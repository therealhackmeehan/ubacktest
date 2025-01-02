import { StrategyResultProps, FormInputProps } from "../../shared/sharedTypes";
import { HttpError } from "wasp/server";

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
    };

    private stderr: string = '';
    private stdout: string = '';
    private warning: string[] = [];

    constructor(formInputs: FormInputProps, code: string) {
        this.formInputs = formInputs;
        this.code = code;
    }

    /////////////////////////________________________________________
    public async run() {
        await this.getStrategyStockData();
        await this.runPythonCode();

        if (this.stderr) return this.sendJSONtoFrontend();

        await this.addSPData();
        this.calculatePortfolio();

        return this.sendJSONtoFrontend();
    }
    /////////////////////////________________________________________

    private sendJSONtoFrontend() {
        return {
            strategyResult: this.strategyResult,
            debugOutput: this.stdout,
            stderr: this.stderr,
            warning: this.warning,
        }
    }

    private async getStrategyStockData() {
        const tempAPIResult = await this.stockAPIHelper(this.formInputs.symbol);
        const normalizedData = this.validateStockDataFromAPI(tempAPIResult);

        // Assign all normalized data fields to strategyResult in one step
        this.strategyResult = {
            ...this.strategyResult,
            ...normalizedData,
        };
    }

    private async runPythonCode() {
        // Generate unique markers for parsing the output
        const uniqueKey = this.generateRandomKey();

        // Extract necessary fields from strategyResult
        const { timestamp, volume, high, low, open, close } = this.strategyResult;
        const toEmbedInMain = { timestamp, volume, high, low, open, close };
        const mainFileContent = StrategyPipeline.main_py(uniqueKey, toEmbedInMain);

        // Prepare the request payload
        const payload = {
            language: "python",
            version: "3.10.0",
            files: [
                { name: "main.py", content: mainFileContent },
                { name: "strategy.py", content: this.code },
            ],
        };

        // Make the API call to execute the Python code
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new HttpError(503, 'Failed to connect to the web and run python code. Try again.');
        }

        // Parse the response
        const { run } = await response.json();
        console.log(run);

        const { stderr = '', stdout = '', signal } = run;

        // Handle resource-limit termination
        if (signal === "SIGKILL" && !stderr && !stdout) {
            throw new HttpError(
                500,
                "SIGKILL: Your program was terminated because it exceeded resource limits."
            );
        }

        // Append warning if `main.py` errors are present
        this.stderr = stderr.includes('main.py')
            ? `Note: Errors originating in "main.py" may be disregarded, as it serves as the processing function orchestrating the test.\n\n${stderr}`
            : stderr;

        // Extract data from the Python output
        const parsedData = this.parsePythonOutput(stdout, uniqueKey);
        if (parsedData) Object.assign(this.strategyResult, parsedData);
        this.stdout = parsedData ? this.stripDebugOutput(stdout, uniqueKey) : stdout
    }

    private async addSPData() {

        let spResult = await this.stockAPIHelper('spy');
        spResult = this.validateStockDataFromAPI(spResult);

        const stockStamp = this.strategyResult.timestamp;
        const spStamp = spResult.timestamp;

        if (StrategyPipeline.arraysAreEqual(stockStamp, spStamp)) {
            this.strategyResult.sp = spResult[this.formInputs.timeOfDay];
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
        const period1 = `period1=${new Date(this.formInputs.startDate).getTime() / 1000}`;
        const period2 = `period2=${new Date(this.formInputs.endDate).getTime() / 1000}`;
        const interval = `interval=${this.formInputs.intval}`;

        const url = `${baseUrl}${symbolPath}?${period1}&${period2}&${interval}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new HttpError(
                503, // Service Unavailable
                `Unable to find or access ${symbol}. Please try again with another (or make sure that the company went public prior to the start date of the backtest).\n\n\n Status Text: '${response.statusText}'`
            );
        }

        return await response.json();
    }

    private validateStockDataFromAPI(tempAPIResult: any) {
        const errMsg = tempAPIResult.chart?.error;
        if (errMsg) throw new HttpError(500, `Stock data retrieval failed or was not found: \n\n\nError Message: '${errMsg}'`);

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
        const startInput = new Date(this.formInputs.startDate).getDay();
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

        // Normalize data by dividing by the first price
        const firstPrice = quote?.[this.formInputs.timeOfDay][0];
        if (!firstPrice || typeof firstPrice !== "number" || isNaN(firstPrice))
            throw new HttpError(500, "First close price is invalid. Cannot normalize data.");

        const normalizedPrices = (prices: number[]) => prices.map(price => price / firstPrice);
        const normalizedQuote = {
            high: normalizedPrices(highPrices),
            low: normalizedPrices(lowPrices),
            open: normalizedPrices(openPrices),
            close: normalizedPrices(closePrices),
            volume: volumes,
            timestamp: timestamps,
        };

        return normalizedQuote;
    }

    private static main_py(uniqueKey: string, toEmbedInMain: any): string {

        const m =

            `# main.py

from strategy import strategy
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

df['signal'].fillna(0, inplace=True)
dfToReturn = df[['signal']].round(3).to_dict('list')

print("${uniqueKey}START${uniqueKey}" + json.dumps(dfToReturn) + "${uniqueKey}END${uniqueKey}")`;

        return m;
    }
}

export default StrategyPipeline;
