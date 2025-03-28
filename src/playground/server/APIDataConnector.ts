import { HttpError } from "wasp/server";
import { FormInputProps } from "../../shared/sharedTypes";

class APIDataConnector {

    private baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
    private formInputs: FormInputProps;
    private decimalPlaces: number = 4;

    constructor(formInputs: FormInputProps) {
        this.formInputs = formInputs;
    }

    public async get(symbol: string) {
        const jsonResponse = await this.apiHelper(symbol);
        return this.validateStockDataFromAPI(jsonResponse);
    }

    private async apiHelper(symbol: string) {
        const symbolPath = `${symbol}`;
        const p1ToUse = this.formInputs.useWarmupDate ? this.formInputs.warmupDate : this.formInputs.startDate;

        const startOfDay = (dateStr: string) => {
            const date = new Date(dateStr);
            return Math.floor(date.getTime() / 1000);
        };

        const period1 = `period1=${startOfDay(p1ToUse as string)}`;
        const period2 = `period2=${startOfDay(this.formInputs.endDate)}`;
        const interval = `interval=${this.formInputs.intval}`;
        const url = `${this.baseUrl}${symbolPath}?${period1}&${period2}&${interval}`;

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

        // Convert to timestamps (milliseconds since epoch)
        const startInput = this.formInputs.useWarmupDate
            ? new Date(this.formInputs.warmupDate).getTime()
            : new Date(this.formInputs.startDate).getTime();
        const endInput = new Date(this.formInputs.endDate).getTime();

        const startInData = new Date(timestamps[0]).getTime() * 1000;
        const endInData = new Date(timestamps[timestamps.length - 1]).getTime() * 1000;
        const isFrequentTrading = this.formInputs.intval === '1d' || this.formInputs.intval === '5d';

        const warning: string[] = [];

        // Convert 5 days to milliseconds
        let fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
        fiveDaysMs = this.formInputs.intval === '5d' ? fiveDaysMs * 5 : fiveDaysMs;

        // Append a warning if there are large chunks of data missing
        if (isFrequentTrading && (Math.abs(startInData - startInput) > fiveDaysMs || Math.abs(endInData - endInput) > fiveDaysMs)) {
            const missingDataMsg =
                'There appears to be a significant discrepancy between the available data and your selected start and end dates. ' +
                'This may indicate that the stock’s data is incomplete due to an IPO occurring after the specified start date, ' +
                'or the stock was delisted during the selected timeframe. Please review the date range and stock availability.';

            warning.push(missingDataMsg);
        }

        // Check for low trading volume. Append a warning if the stock is small/volatile.
        if (volumes.some(val => val < 1000)) {
            const lowVolumeMsg =
                'The selected stock exhibits low trading volume, which may result in increased price volatility and unpredictable behavior. ' +
                'Exercise caution when testing your strategy with this stock.';

            warning.push(lowVolumeMsg);
        }

        // filter data for shortened version based on timestamp limit
        const shortenedIndex = timestamps.findIndex(ts => ts >= new Date(this.formInputs.startDate).getTime() / 1000);
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
        const newFirstPrice = shortenedIndex >= 0 ? quote['close'][shortenedIndex] : null;
        if (!newFirstPrice || typeof newFirstPrice !== "number" || isNaN(newFirstPrice)) {
            throw new HttpError(500, "First price of shortened data is invalid. Cannot normalize shortened data.");
        }

        const shortenedNormalizedPrices = (prices: number[]) => prices.map(price => Math.round((price / newFirstPrice) * 10 ** this.decimalPlaces) / 10 ** this.decimalPlaces);

        // round and normalize the standard trading period's data (without burn-in period)
        const shortenedNormalizedQuote = {
            high: shortenedNormalizedPrices(shortenedHighPrices),
            low: shortenedNormalizedPrices(shortenedLowPrices),
            open: shortenedNormalizedPrices(shortenedOpenPrices),
            close: shortenedNormalizedPrices(shortenedClosePrices),
            volume: shortenedVolumes,
            timestamp: shortenedTimestamps,
        };

        // round and normalize all data based on the first value (with burn-in period)
        const normalizedQuote = {
            high: shortenedNormalizedPrices(highPrices),
            low: shortenedNormalizedPrices(lowPrices),
            open: shortenedNormalizedPrices(openPrices),
            close: shortenedNormalizedPrices(closePrices),
            volume: volumes,
            timestamp: timestamps,
        };

        return { normalizedQuote, shortenedNormalizedQuote, warning };
    }

}

export default APIDataConnector;