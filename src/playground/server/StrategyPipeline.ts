import { StrategyResultProps, FormInputProps, PythonDataProps, UserDefinedData } from "../../shared/sharedTypes";
import CodeExecutor from "./CodeExecutor";
import { HttpError } from "wasp/server";

/*
    Main backend endpoint for processing of the stock trading strategy.
    Will search for data and apply the given python strategy.

    Returns some debug output, any warnings to display, and the JSON data
    describing the result of the strategy.
*/

class StrategyPipeline {

    // Store user inputs in formInputs, code in code.
    private formInputs: FormInputProps;
    private code: string;

    // initialize the final result with empty arrays
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

    // save a copy of the data for python
    private toInsertInPython: PythonDataProps = {
        timestamp: [],
        open: [],
        close: [],
        high: [],
        low: [],
        volume: [],
    }

    // store code execution outputs
    private stderr: string = '';
    private stdout: string = '';
    private warning: string[] = [];

    // decimals, for future consideration... (storage constraints)
    private decimalPlaces: number = 4;

    constructor(formInputs: FormInputProps, code: string) {
        this.formInputs = formInputs;
        this.code = code;
    }

    //________________________________________ run: main endpoint
    public async run() {

        // Make a call to the stock API and gather data
        await this.getStrategyStockData();

        // With data already gathered, execute user code
        const { stdout, stderr, uniqueKey } = await new CodeExecutor(this.code, this.toInsertInPython, this.formInputs.startDate).execute();

        this.stderr = stderr;

        // if code executed successfully, extract the important output
        const parsedData = StrategyPipeline.parsePythonOutput(stdout, uniqueKey);
        if (parsedData) {
            Object.assign(this.strategyResult, parsedData.result);

            const expectedLength = this.strategyResult.signal.length;
            const userDefinedData: UserDefinedData = parsedData.data;

            // if user has defined any custom columns, save those
            // so that they can be viewed later in the result
            this.strategyResult.userDefinedData = Object.fromEntries(
                Object.entries(userDefinedData).filter(([_, value]) =>
                    Array.isArray(value) &&
                    value.length === expectedLength &&
                    value.every(item => typeof item === 'number')
                )
            )
        };

        this.stdout = StrategyPipeline.stripDebugOutput(stdout, uniqueKey);

        // if code did not execute successfully, return and error
        if (this.stderr) return this.sendJSONtoFrontend();

        try { // add S&P 500 data to the result
            await this.addSPData();
        } catch (Error: any) { // Just move on if errors (not crucial to result)
            this.warning.push("An issue occured with fetching S&P Comparison Data, so it will be excluded from this backtest.");
        }

        this.calculatePortfolio(); // calculate risk ratios and trade metrics
        this.validatePortfolio(); // make sure the portfolio is realistic and accurate

        return this.sendJSONtoFrontend();
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

            // use previous timepoints to create an array of daily returns
            const ret = (curr - prev) / prev;
            const curvedRet = ret * prevSignal;
            this.strategyResult.returns[i] = curvedRet;

            // Update portfolio without costs according to return
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

        // after completing calculations, round to specified decimal place
        this.strategyResult.returns = this.strategyResult.returns.map(val => this.roundTo(val));
        this.strategyResult.portfolio = this.strategyResult.portfolio.map(val => this.roundTo(val));
        this.strategyResult.portfolioWithCosts = this.strategyResult.portfolioWithCosts.map(val => this.roundTo(val));
    }

    private roundTo(value: number): number {
        return Math.round(value * 10 ** this.decimalPlaces) / (10 ** this.decimalPlaces);
    }

    private validatePortfolio() {

        // for each of the crucial columns, check they all match in length
        const requiredKeys: (keyof StrategyResultProps)[] = ['portfolio', 'portfolioWithCosts', 'signal', 'returns'];
        const lengths = requiredKeys.map(key => this.strategyResult[key]?.length);
        const allLengthsMatch = lengths.every(length => length === lengths[0]);

        if (!allLengthsMatch || lengths.some(length => length === 0)) {
            throw new HttpError(500, 'Your portfolio arrays are missing or mismatched in length.');
        }

        // for each crucial columns, make sure data is real and valid
        const allDataIsValid = requiredKeys.every(key => {
            const data = this.strategyResult[key];
            return Array.isArray(data) && data.every(
                value => value !== null && value !== undefined && !Number.isNaN(value)
            );
        });
        if (!allDataIsValid) {
            throw new HttpError(500, 'Your portfolio contains invalid data (null, undefined, or NaN).');
        }

        // (shouldn't ever happen) make sure portfolio is positive
        const portfoliosNonNegative = this.strategyResult.portfolio.every(value => value >= 0) &&
            this.strategyResult.portfolioWithCosts.every(value => value >= 0);
        if (!portfoliosNonNegative) {
            throw new HttpError(500, 'Your portfolio contains negative values, which is not allowed.');
        }

        // make sure trading signals fall within allowed range 
        const returnsWithinBounds = this.strategyResult.returns.every(value => value >= -1 && value <= 1);
        if (!returnsWithinBounds) {
            throw new HttpError(500, 'Your portfolio returns contain unrealistic values.');
        }

        // check timestamps for valid idx trend
        const timestampsAreMonotonic = this.strategyResult.timestamp.every(
            (value, index, array) => index === 0 || value > array[index - 1]
        );
        if (!timestampsAreMonotonic) {
            throw new HttpError(500, 'Timestamps in your portfolio data are not in chronological order.');
        }
    }

    private static parsePythonOutput(stdout: string, uniqueKey: string) {
        const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
        const match = stdout.match(regex);
        return match ? JSON.parse(match[1]) : null;
    }

    private static stripDebugOutput(stdout: string, uniqueKey: string) {
        const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
        return stdout.replace(regex, '').trim();
    }

    private async addSPData() {

        // call the stock API for 'SPY'
        const spResult = await this.stockAPIHelper('spy');
        const { shortenedNormalizedQuote } = this.validateStockDataFromAPI(spResult);

        const stockStamp = this.strategyResult.timestamp;
        const spStamp = shortenedNormalizedQuote.timestamp;

        // if the s&p data aligns as expected, add it to the final result
        if (StrategyPipeline.arraysAreEqual(stockStamp, spStamp)) {
            this.strategyResult.sp = shortenedNormalizedQuote[this.formInputs.timeOfDay];
        }
    }

    private async getStrategyStockData() {
        const tempAPIResult = await this.stockAPIHelper(this.formInputs.symbol);

        // gather both the normalized quote and shortened normalized quote
        // (longer normalized quote only applies when burn-in period)
        const { normalizedQuote, shortenedNormalizedQuote } = this.validateStockDataFromAPI(tempAPIResult);

        // Assign all normalized data fields to strategyResult in one step
        this.strategyResult = {
            ...this.strategyResult,
            ...shortenedNormalizedQuote,
        };

        // save unshortened data for use in python 
        // (again, this is for the integration of burn-in period only)
        this.toInsertInPython = normalizedQuote;
    }


    private async stockAPIHelper(symbol: string) {

        const baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
        const symbolPath = `${symbol}`;
        const p1ToUse = this.formInputs.useWarmupDate ? this.formInputs.warmupDate : this.formInputs.startDate;

        const startOfDay = (dateStr: string) => {
            const date = new Date(dateStr);
            return Math.floor(date.getTime() / 1000);
        };

        const period1 = `period1=${startOfDay(p1ToUse as string)}`;
        const period2 = `period2=${startOfDay(this.formInputs.endDate)}`;
        const interval = `interval=${this.formInputs.intval}`;

        const url = `${baseUrl}${symbolPath}?${period1}&${period2}&${interval}`;

        console.log(url);

        // access stock data endpoint using user formInputs
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

        // if no error in accessing the API, continue with the full response
        return responseJson;
    }

    private validateStockDataFromAPI(tempAPIResult: any) {

        // error out-of-the gate if there is an error message found
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

        // if the data is empty, no data found for the specific stock
        if (!closePrices) throw new HttpError(400, "Although it appears this stock exists, no data was found. Try another stock or adjust the timeframe.");

        // not enough data remaining
        if (!Array.isArray(closePrices) || closePrices.length < 5)
            throw new HttpError(400, "Less than 5 data points available for a backtest.");

        // non-real or invalid numbers were returned
        if (!closePrices.every((price) => typeof price === "number" && !isNaN(price)))
            throw new HttpError(400, "Invalid data detected in close prices.");

        // mismatch in length between crucial columns
        if (!Array.isArray(timestamps) || timestamps.length !== closePrices.length)
            throw new HttpError(500, "Mismatch between timestamps and close prices.");
        
        // non-array results
        if (!Array.isArray(highPrices) || !Array.isArray(lowPrices) || !Array.isArray(openPrices) || !Array.isArray(volumes))
            throw new HttpError(500, "Invalid structure for high, low, or open data. Expected arrays.");

        // mismatch in length between remaining columns
        if (highPrices.length !== closePrices.length || lowPrices.length !== closePrices.length || openPrices.length !== closePrices.length)
            throw new HttpError(500, "Mismatch in data length for high, low, open, and close arrays.");

        // too much data. Doable but resource constraints... (can tweak later)
        if (timestamps.length > 1000) {
            throw new HttpError(400, "Sorry, we don't support backtests that are more than 1000 timepoints.");
        }

        // Check for missing data based on user-selected dates
        const startInput = this.formInputs.useWarmupDate ? new Date(this.formInputs.warmupDate).getDay() : new Date(this.formInputs.startDate).getDay();
        const endInput = new Date(this.formInputs.endDate).getDay();

        const startInData = new Date(timestamps[0]).getDay();
        const endInData = new Date(timestamps[timestamps.length - 1]).getDay();
        const isFrequentTrading = this.formInputs.intval === '1d' || this.formInputs.intval === '5d';

        // append a warning if there are large chunks of data missing
        if (isFrequentTrading && (Math.abs(startInData - startInput) > 7 || Math.abs(endInData - endInput) > 7)) {
            const missingDataMsg =
                'There appears to be a significant discrepancy between the available data and your selected start and end dates. ' +
                'This may indicate that the stock’s data is incomplete due to an IPO occurring after the specified start date, ' +
                'or the stock was delisted during the selected timeframe. Please review the date range and stock availability.';

            this.warning.push(missingDataMsg);
        }

        // Check for low trading volume. Append a warning if the stock is small/volatile.
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

        const normalizedPrices = (prices: number[]) => prices.map(price => Math.round((price / firstPrice) * 10 ** this.decimalPlaces) / 10 ** this.decimalPlaces);

        // round and normalize all data based on the first value (with burn-in period)
        const normalizedQuote = {
            high: normalizedPrices(highPrices),
            low: normalizedPrices(lowPrices),
            open: normalizedPrices(openPrices),
            close: normalizedPrices(closePrices),
            volume: volumes,
            timestamp: timestamps,
        };

        // filter data for shortened version based on timestamp limit
        const shortenedIndex = normalizedQuote.timestamp.findIndex(ts => ts >= new Date(this.formInputs.startDate).getTime() / 1000);
        if (shortenedIndex === -1) {
            throw new HttpError(400, "No data exists after the specified timestamp.");
        }
        
        // chop data to typical range and proceed (only applicable for burn-in period)
        const shortenedHighPrices = highPrices.slice(shortenedIndex);
        const shortenedLowPrices = lowPrices.slice(shortenedIndex);
        const shortenedOpenPrices = openPrices.slice(shortenedIndex);
        const shortenedClosePrices = closePrices.slice(shortenedIndex);
        const shortenedVolumes = volumes.slice(shortenedIndex);
        const shortenedTimestamps = timestamps.slice(shortenedIndex);

        // recalculate the first price for shortened data
        const newFirstPrice = shortenedIndex >= 0 ? quote[this.formInputs.timeOfDay][shortenedIndex] : null;
        if (!newFirstPrice || typeof newFirstPrice !== "number" || isNaN(newFirstPrice)) {
            throw new HttpError(500, "First price of shortened data is invalid. Cannot normalize shortened data.");
        }

        const shortenedNormalizedPrices = (prices: number[]) =>
            prices.map(price => Math.round((price / newFirstPrice) * 10 ** this.decimalPlaces) / 10 ** this.decimalPlaces);

        // round and normalize the standard trading period's data (without burn-in period)
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
}

export default StrategyPipeline;
