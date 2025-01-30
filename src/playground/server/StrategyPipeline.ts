import { StrategyResultProps, FormInputProps, UserDefinedData, PythonDataProps } from "../../shared/sharedTypes";
import { HttpError } from "wasp/server";
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { createWriteStream, readFileSync } from 'fs';

/*
    Main backend endpoint for processing of the stock trading strategy.
    Will search for data and apply the strategy.

    Returns some debug output, any warnings to display, and the JSON data
    describing the result of the strategy.
*/

class StrategyPipeline {

    private formInputs: FormInputProps;
    private code: string;

    // initialize the JSON result with empty arrays
    private strategyResult: StrategyResultProps = {
        timestamp: [],
        open: [],
        close: [],
        high: [],
        low: [],
        volume: [],
        sp: [],
        portfolio: [],
        portfolioWithCosts: [],
        signal: [],
        returns: [],
        userDefinedData: {},
    };

    private toInsertInPython: PythonDataProps = {
        timestamp: [],
        open: [],
        close: [],
        high: [],
        low: [],
        volume: [],
    }

    private stderr: string = '';
    private stdout: string = '';
    private warning: string[] = [];

    constructor(formInputs: FormInputProps, code: string) {
        this.formInputs = formInputs;
        this.code = code;
    }

    //________________________________________
    public async run() {

        await this.getStrategyStockData();                      // 1. get data from stock data API
        await this.runPythonCode();                             // 2. run user-submitted python code

        if (this.stderr) return this.sendJSONtoFrontend();      // 3. if stderr exists, we're done.

        try {
            await this.addSPData();                             // 4. append SP data for comparison!
        } catch (Error: any) {
            this.warning.push("An issue occured with fetching S&P Comparison Data, so it will be excluded from this backtest.");
        }

        this.calculatePortfolio();                              // 5. calculate porfolio and success metrics
        this.validatePortfolio();                               // 6. make sure the portfolio makes sense

        return this.sendJSONtoFrontend();                       // 7. send back all our data to the frontend
    }
    //________________________________________

    private sendJSONtoFrontend() {
        return {
            strategyResult: this.strategyResult,
            debugOutput: this.stdout,
            stderr: this.stderr,
            warnings: [...new Set(this.warning)],
        }
    }

    private async getStrategyStockData() {
        const tempAPIResult = await this.stockAPIHelper(this.formInputs.symbol);
        const { normalizedQuote, shortenedNormalizedQuote } = this.validateStockDataFromAPI(tempAPIResult);

        // Assign all normalized data fields to strategyResult in one step
        this.strategyResult = {
            ...this.strategyResult,
            ...shortenedNormalizedQuote,
        };

        this.toInsertInPython = normalizedQuote;
    }

    private async runPythonCode() {
        // Generate unique markers for parsing the output
        const uniqueKey = this.generateRandomKey();
        const mainFileContent = StrategyPipeline.main_py(this.code, uniqueKey, this.toInsertInPython, this.formInputs.startDate);

        // get zip options (base 64)
        console.log('about to zip');
        const zipped = await StrategyPipeline.zipFiles(mainFileContent);
        const { stdout, stderr } = await StrategyPipeline.judge0_zipped(zipped);

        //const { stdout, stderr } = await StrategyPipeline.judge0_post(mainFileContent);
        this.stderr = stderr;

        // Extract data, result from the Python output
        const parsedData = this.parsePythonOutput(stdout, uniqueKey);
        if (parsedData) {
            Object.assign(this.strategyResult, parsedData.result);

            const expectedLength = this.strategyResult.signal.length;
            const userDefinedData: UserDefinedData = parsedData.data;

            this.strategyResult.userDefinedData = Object.fromEntries(
                Object.entries(userDefinedData).filter(([_, value]) =>
                    Array.isArray(value) && // Ensure it's an array
                    value.length === expectedLength &&  // Length is exactly 3
                    value.every(item => typeof item === 'number') // All elements are numbers
                )
            )
        };

        this.stdout = this.stripDebugOutput(stdout, uniqueKey);
    }

    private async addSPData() {

        const spResult = await this.stockAPIHelper('spy');
        const { shortenedNormalizedQuote } = this.validateStockDataFromAPI(spResult);

        const stockStamp = this.strategyResult.timestamp;
        const spStamp = shortenedNormalizedQuote.timestamp;

        if (StrategyPipeline.arraysAreEqual(stockStamp, spStamp)) {
            this.strategyResult.sp = shortenedNormalizedQuote[this.formInputs.timeOfDay];
        }
    }

    private calculatePortfolio() {
        this.strategyResult.portfolio[0] = 1;
        this.strategyResult.portfolioWithCosts[0] = 1;
        this.strategyResult.returns[0] = 0;

        const timeOfDayKey: 'open' | 'close' | 'high' | 'low' = this.formInputs.timeOfDay;
        for (let i = 1; i < this.strategyResult.timestamp.length; i++) {

            const curr = this.strategyResult[timeOfDayKey][i];
            const prev = this.strategyResult[timeOfDayKey][i - 1];

            const prevSignal = this.strategyResult.signal[i - 1];
            const prevPrevSignal = i === 1 ? 0 : this.strategyResult.signal[i - 2];

            const ret = (curr - prev) / prev;
            const curvedRet = ret * prevSignal;
            this.strategyResult.returns[i] = curvedRet;

            // Update portfolio without costs
            this.strategyResult.portfolio[i] = this.strategyResult.portfolio[i - 1] * (1 + curvedRet);
            if (this.strategyResult.portfolio[i] < 0) {
                this.strategyResult.portfolio[i] = 0;
            }

            // Calculate trade costs
            const tradeValue = Math.abs(prevSignal - prevPrevSignal) * this.strategyResult.portfolioWithCosts[i - 1];
            const tradeCost = tradeValue * this.formInputs.costPerTrade;

            // Update portfolio with costs
            this.strategyResult.portfolioWithCosts[i] = this.strategyResult.portfolioWithCosts[i - 1] * (1 + curvedRet) - tradeCost / 100;

            // Prevent portfolio from going negative
            if (this.strategyResult.portfolioWithCosts[i] < 0) {
                this.strategyResult.portfolioWithCosts[i] = 0;
            }
        }
    }

    private validatePortfolio() {
        // Step 1: Verify that all necessary data arrays exist and have the same length
        const requiredKeys: (keyof StrategyResultProps)[] = ['portfolio', 'portfolioWithCosts', 'signal', 'returns'];
        const lengths = requiredKeys.map(key => this.strategyResult[key]?.length);
        const allLengthsMatch = lengths.every(length => length === lengths[0]);

        if (!allLengthsMatch || lengths.some(length => length === 0)) {
            throw new HttpError(500, 'Your portfolio arrays are missing or mismatched in length.');
        }

        const allDataIsValid = requiredKeys.every(key => {
            const data = this.strategyResult[key];
            return Array.isArray(data) && data.every(
                value => value !== null && value !== undefined && !Number.isNaN(value)
            );
        });
        if (!allDataIsValid) {
            throw new HttpError(500, 'Your portfolio contains invalid data (null, undefined, or NaN).');
        }

        const portfoliosNonNegative = this.strategyResult.portfolio.every(value => value >= 0) &&
            this.strategyResult.portfolioWithCosts.every(value => value >= 0);
        if (!portfoliosNonNegative) {
            throw new HttpError(500, 'Your portfolio contains negative values, which is not allowed.');
        }

        const returnsWithinBounds = this.strategyResult.returns.every(value => value >= -1 && value <= 1);
        if (!returnsWithinBounds) {
            throw new HttpError(500, 'Your portfolio returns contain unrealistic values.');
        }

        const timestampsAreMonotonic = this.strategyResult.timestamp.every(
            (value, index, array) => index === 0 || value > array[index - 1]
        );

        if (!timestampsAreMonotonic) {
            throw new HttpError(500, 'Timestamps in your portfolio data are not in chronological order.');
        }
    }

    /// helper functions
    private static arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) {
            return false;
        }

        // Compare each element
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    private parsePythonOutput(stdout: string, uniqueKey: string) {
        const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
        const match = stdout.match(regex);
        return match ? JSON.parse(match[1]) : null;
    }

    private stripDebugOutput(stdout: string, uniqueKey: string) {
        const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
        return stdout.replace(regex, '').trim();
    }

    private generateRandomKey(): string {
        return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    }

    private async stockAPIHelper(symbol: string) {

        const baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
        const symbolPath = `${symbol}`;
        const p1ToUse = this.formInputs.useWarmupDate ? this.formInputs.warmupDate : this.formInputs.startDate;

        const startOfDay = (dateStr: string) => {
            const date = new Date(dateStr);
            if (!["1m", "2m"].includes(this.formInputs.intval)) {
                date.setHours(0, 0, 0, 0);
            }
            return Math.floor(date.getTime() / 1000);
        };

        const period1 = `period1=${startOfDay(p1ToUse as string)}`;
        const period2 = `period2=${startOfDay(this.formInputs.endDate)}`;
        const interval = `interval=${this.formInputs.intval}`;

        const url = `${baseUrl}${symbolPath}?${period1}&${period2}&${interval}`;

        console.log(url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        const responseJson = await response.json();

        if (!response.ok) {
            const errMsg = responseJson.chart?.error.description;
            throw new HttpError(
                503, // Service Unavailable
                `Unable to find or access ${symbol} at that range. Please try again with another symbol (or make sure that the company went public prior to the start date of the backtest).\n\n\n Status Message: '${errMsg || 'none'}'`
            );
        }

        return responseJson;
    }

    private validateStockDataFromAPI(tempAPIResult: any) {
        const errMsg = tempAPIResult.chart?.error;
        if (errMsg) throw new HttpError(500, `Stock data retrieval failed or was not found: \n\n\nError Message: ${errMsg}`);

        const result = tempAPIResult.chart.result?.[0];
        const quote = result?.indicators?.quote?.[0];

        const closePrices = quote?.close;
        const highPrices = quote?.high;
        const lowPrices = quote?.low;
        const openPrices = quote?.open;
        const timestamps = result?.timestamp;
        const volumes = quote?.volume;

        // Validation checks
        if (!closePrices) throw new HttpError(400, "Although it appears this stock exists, no data was found. Try another stock or adjust the timeframe.");
        if (!Array.isArray(closePrices) || closePrices.length < 5)
            throw new HttpError(400, "Less than 5 data points available for a backtest.");

        if (!closePrices.every((price) => typeof price === "number" && !isNaN(price)))
            throw new HttpError(400, "Invalid data detected in close prices.");
        if (!Array.isArray(timestamps) || timestamps.length !== closePrices.length)
            throw new HttpError(500, "Mismatch between timestamps and close prices.");
        if (!Array.isArray(highPrices) || !Array.isArray(lowPrices) || !Array.isArray(openPrices) || !Array.isArray(volumes))
            throw new HttpError(500, "Invalid structure for high, low, or open data. Expected arrays.");
        if (highPrices.length !== closePrices.length || lowPrices.length !== closePrices.length || openPrices.length !== closePrices.length)
            throw new HttpError(500, "Mismatch in data length for high, low, open, and close arrays.");

        // Check for missing data based on user-selected dates
        const startInput = this.formInputs.useWarmupDate ? new Date(this.formInputs.warmupDate).getDay() : new Date(this.formInputs.startDate).getDay();
        const endInput = new Date(this.formInputs.endDate).getDay();

        const startInData = new Date(timestamps[0]).getDay();
        const endInData = new Date(timestamps[timestamps.length - 1]).getDay();
        const isFrequentTrading = this.formInputs.intval === '1d' || this.formInputs.intval === '5d';

        if (isFrequentTrading && (Math.abs(startInData - startInput) > 7 || Math.abs(endInData - endInput) > 7)) {
            const missingDataMsg =
                'There appears to be a significant discrepancy between the available data and your selected start and end dates. ' +
                'This may indicate that the stock’s data is incomplete due to an IPO occurring after the specified start date, ' +
                'or the stock was delisted during the selected timeframe. Please review the date range and stock availability.';

            this.warning.push(missingDataMsg);
        }

        // Check for low trading volume
        if (volumes.some(val => val < 1000)) {
            const lowVolumeMsg =
                'The selected stock exhibits low trading volume, which may result in increased price volatility and unpredictable behavior. ' +
                'Exercise caution when testing your strategy with this stock.';

            this.warning.push(lowVolumeMsg);
        }

        const firstPrice = quote?.[this.formInputs.timeOfDay][0];
        if (!firstPrice || typeof firstPrice !== "number" || isNaN(firstPrice)) {
            throw new HttpError(500, "First close price is invalid. Cannot normalize data.");
        }

        const normalizedPrices = (prices: number[]) => prices.map(price => price / firstPrice);

        // Normalize all data
        const normalizedQuote = {
            high: normalizedPrices(highPrices),
            low: normalizedPrices(lowPrices),
            open: normalizedPrices(openPrices),
            close: normalizedPrices(closePrices),
            volume: volumes,
            timestamp: timestamps,
        };

        // Filter data for shortened version based on timestamp limit
        const shortenedIndex = normalizedQuote.timestamp.findIndex(ts => ts >= new Date(this.formInputs.startDate).getTime() / 1000);
        if (shortenedIndex === -1) {
            throw new HttpError(400, "No data exists after the specified timestamp.");
        }

        const shortenedHighPrices = highPrices.slice(shortenedIndex);
        const shortenedLowPrices = lowPrices.slice(shortenedIndex);
        const shortenedOpenPrices = openPrices.slice(shortenedIndex);
        const shortenedClosePrices = closePrices.slice(shortenedIndex);
        const shortenedVolumes = volumes.slice(shortenedIndex);
        const shortenedTimestamps = timestamps.slice(shortenedIndex);

        // Recalculate the first price for shortened data
        const newFirstPrice = shortenedIndex >= 0 ? quote[this.formInputs.timeOfDay][shortenedIndex] : null;
        if (!newFirstPrice || typeof newFirstPrice !== "number" || isNaN(newFirstPrice)) {
            throw new HttpError(500, "First price of shortened data is invalid. Cannot normalize shortened data.");
        }

        const shortenedNormalizedPrices = (prices: number[]) =>
            prices.map(price => price / newFirstPrice);

        const shortenedNormalizedQuote = {
            high: shortenedNormalizedPrices(shortenedHighPrices),
            low: shortenedNormalizedPrices(shortenedLowPrices),
            open: shortenedNormalizedPrices(shortenedOpenPrices),
            close: shortenedNormalizedPrices(shortenedClosePrices),
            volume: shortenedVolumes,
            timestamp: shortenedTimestamps,
        };

        return { normalizedQuote, shortenedNormalizedQuote };
    }

    // static functions 
    private static async judge0_zipped(zip: string) {
        const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': process.env.JUDGE_APIKEY,
                'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language_id: 89,
                source_code: "",
                additional_files: zip
            })
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new HttpError(503, `In Executing Code, Unable to make that request: ${response.statusText}`);
        }

        const submissionData = await response.json();
        const token = submissionData.token;
        console.log(`[${new Date().toISOString()}] Submission Token: ${token}`);

        const maxAttempts = 10;
        let attempt = 0;
        let statusId = 1;

        while (attempt < maxAttempts) {
            await new Promise((res) => setTimeout(res, (attempt / 2) * 1000)); // Incremental delay (0.5s, 1s, 1.5s, ...)

            const url2 = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`;
            const options2 = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': process.env.JUDGE_APIKEY,
                    'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            };
            const response2 = await fetch(url2, options2)

            if (!response2.ok) {
                throw new Error(`Failed to get submission status: ${response2.statusText}`);
            }

            const resultData = await response2.json();
            statusId = resultData.status?.id;

            console.log(`[${new Date().toISOString()}] Polling Status ID: ${statusId}`);

            if (statusId !== 1 && statusId !== 2) {
                return {
                    stdout: StrategyPipeline.decodeBase64(resultData.stdout) || '',
                    stderr: StrategyPipeline.decodeBase64(resultData.stderr) || '',
                    // compile_output: resultData.compile_output || '',
                    // message: resultData.message || ''
                };
            }

            attempt++;
        }

        const fullResult = await response.json();
        console.log(fullResult);
        let { stdout, stderr } = fullResult;

        if (!stdout) stdout = '';
        if (!stderr) stderr = '';

        return { stdout, stderr };
    }

    private static decodeBase64(base64String: string | null): string {
        if (!base64String) return ''; // Handle empty/null cases
        return Buffer.from(base64String, 'base64').toString('utf-8');
    }

    private static async judge0_post(mainFileContent: string) {

        const url = 'https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': process.env.JUDGE_APIKEY,
                'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language_id: 25,
                source_code: mainFileContent
            })
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new HttpError(503, `In Executing Code, Unable to make that request: ${response.statusText}`);
        }

        const fullResult = await response.json();
        console.log(fullResult);
        let { stdout, stderr } = fullResult;

        if (!stdout) stdout = '';
        if (!stderr) stderr = '';

        return { stdout, stderr };
    }

    private static main_py(code: string, uniqueKey: string, toEmbedInMain: any, startDate: string): string {

        const dateToCompare = new Date(startDate).getTime() / 1000;

        const m =

            `${code}

import json
import pandas as pd

jsonCodeUnformatted = '${JSON.stringify(toEmbedInMain)}'
jsonCodeFormatted = json.loads(jsonCodeUnformatted)

df = pd.DataFrame(jsonCodeFormatted)
initHeight = df.shape[0]

df = strategy(df)

if not isinstance(df, pd.DataFrame):
    raise Exception("You must return a dataframe from your strategy.")

df.columns = df.columns.str.lower()

if 'signal' not in df.columns:
    raise Exception("There is no 'signal' column in the table.")

if (df.columns == 'signal').sum() > 1:
    raise Exception("There are two or more 'signal' columns in the table.")

if df['signal'].empty:
    raise Exception("'signal' column is empty.")

if not df.index.is_unique:
    raise Exception("Table index is not unique.")

if df.shape[0] != initHeight:
    raise Exception("The height of the dataframe has changed upon applying your strategy.")

df = df[df['timestamp'] >= ${dateToCompare}]

df['signal'] = df['signal'].fillna(method='ffill').fillna(0)
signalToReturn = df[['signal']].round(3).to_dict('list')

colsToExclude = {"open", "close", "high", "low", "volume", "timestamp", "signal"}

middleOutput = {
    "result": signalToReturn,
    "data": df.loc[:, ~df.columns.isin(colsToExclude)].fillna(0).round(3).to_dict('list')
}

output = "${uniqueKey}START${uniqueKey}" + json.dumps(middleOutput) + "${uniqueKey}END${uniqueKey}"
print(output)`;

        return m;
    }

    private static async zipFiles(codeToEmbed: string) {
        try {
            const zipPath = path.join(process.cwd(), 'output.zip');
            const output = await fs.open(zipPath, 'w');
            const archive = archiver('zip', { zlib: { level: 9 } });

            archive.pipe(output.createWriteStream());

            // Create the dynamically generated file (e.g., strategy.py)
            const textFilePath = path.join(process.cwd(), 'strategy.py');
            await fs.writeFile(textFilePath, codeToEmbed); // Write the string content to file
            archive.file(textFilePath, { name: 'strategy.py' }); // Add to zip

            // Add additional files
            const additionalFilesPath = path.join(process.cwd());
            const files = await fs.readdir(additionalFilesPath);

            for (const file of files) {
                const filePath = path.join(additionalFilesPath, file);
                archive.file(filePath, { name: file });
            }

            await archive.finalize();
            output.close();

            // Read the ZIP file and encode in Base64
            const zipBuffer = await fs.readFile(zipPath);
            const zipBase64 = zipBuffer.toString('base64');

            return zipBase64;
        } catch (error) {
            console.error("Error creating Base64 ZIP:", error);
        }
    }
}

export default StrategyPipeline;
