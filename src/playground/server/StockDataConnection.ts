import { HttpError } from "wasp/server";
import { FormInputProps } from "../../shared/sharedTypes";
import { intVals, eodFreqs } from "../../shared/sharedTypes";

type QuoteColumns = Record<string, any[]>;

class StockDataConnection {
    private readonly baseUrlEOD: string = "https://api.tiingo.com/tiingo/daily";
    private readonly baseUrlIntraday: string = "https://api.tiingo.com/iex/";
    private readonly decimalPlaces: number = 4;

    private readonly minutesPerInterval: Record<typeof intVals[number], number> = {
        "1min": 1,
        "5min": 5,
        "15min": 15,
        "30min": 30,
        "1hour": 60,
        "90min": 90,
        "3hour": 180,
        "daily": 60 * 24,
        "weekly": 60 * 24 * 7,
        "monthly": 60 * 24 * 30, // rough approximation
    };

    private isEOD: boolean;
    private useAdjusted: boolean;
    private start: Date;
    private end: Date;

    constructor(private formInputs: FormInputProps) {
        this.isEOD = eodFreqs.includes(this.formInputs.intval);
        this.useAdjusted = this.isEOD && this.formInputs.useAdjClose;
        this.start = new Date(this.formInputs.useWarmupDate ? this.formInputs.warmupDate : this.formInputs.startDate);
        this.end = new Date(this.formInputs.endDate);
    }

    public async get(symbol: string) {
        const approxDataLength = this.calcApproxDataLength();
        if (approxDataLength > 1000) {
            throw new HttpError(400, "Backtests limited to ~1000 data points. We calculated approximately " + approxDataLength.toString() + " timepoints");
        }

        const rawData = await this.fetchStockData(symbol);
        return this.processStockData(rawData);
    }

    private async fetchStockData(symbol: string): Promise<any> {
        const { startDate, endDate, warmupDate, useWarmupDate, intval } = this.formInputs;
        const effectiveStart = useWarmupDate ? warmupDate : startDate;

        const baseUrl = this.isEOD ? this.baseUrlEOD : this.baseUrlIntraday;
        const extraColumns = this.isEOD ? "" : "&columns=open,high,low,close,volume";

        const url = `${baseUrl}/${symbol}/prices?startDate=${effectiveStart}&endDate=${endDate}&resampleFreq=${intval}${extraColumns}&token=${process.env.TIINGO_API_KEY}`;
        const response = await fetch(url, { headers: { "Content-Type": "application/json" } });
        const json = await response.json();

        if (!response.ok) throw new HttpError(503, `Error in retrieving data for ${symbol}.\n\n${(json) || "'Unknown Error'"}.`);
        return json;
    }

    private processStockData(apiResult: any) {
        const quote = StockDataConnection.rowsToColumns(apiResult);
        this.validateData(quote);
        const warnings: string[] = this.generateWarnings(quote);
        const { normalizedQuote, shortenedNormalizedQuote } = this.normalizeAndShortenData(quote);

        return { normalizedQuote, shortenedNormalizedQuote, warnings };
    }

    private calcApproxDataLength(): number {
        const start = new Date(this.start);
        const end = new Date(this.end);

        let totalMinutes = 0;
        const current = new Date(start);
        while (current <= end) {
            const dayOfWeek = current.getDay(); // 0=Sun, 6=Sat
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                totalMinutes += 24 * 60; // 6.5 hours per trading day
            }
            current.setDate(current.getDate() + 1);
        }

        const minutesPerInt = this.minutesPerInterval[
            this.formInputs.intval as typeof intVals[number]
        ];

        if (!minutesPerInt) throw new Error(`Unsupported interval: ${this.formInputs.intval}`);
        return Math.floor(totalMinutes / minutesPerInt);
    }

    private validateData(quote: QuoteColumns): void {

        const missingClosePricesMsg = "Stock exists but no data found. Try another stock or timeframe.";
        if (this.isEOD) {
            const { adjClose } = quote;
            if (!adjClose) throw new HttpError(400, missingClosePricesMsg);
        }

        const { close, high, low, open, volume, date } = quote;
        if (!close) throw new HttpError(400, missingClosePricesMsg);
        if (close.length < 5) {
            throw new HttpError(400, "Less than 5 data points available for backtest.");
        }
        if (!close.every((p) => typeof p === "number" && !isNaN(p))) {
            throw new HttpError(400, "Invalid close prices returned.");
        }
        if (!Array.isArray(date) || date.length !== close.length) {
            throw new HttpError(500, "Mismatch between timestamps and close prices.");
        }
        if (![high, low, open, volume].every((arr) => Array.isArray(arr))) {
            throw new HttpError(500, "Expected arrays for high/low/open/volume.");
        }
        if ([high, low, open].some((arr) => arr.length !== close.length)) {
            throw new HttpError(500, "Data length mismatch among high/low/open/close.");
        }
    }

    private generateWarnings(quote: QuoteColumns): string[] {
        const { date, volume, splitFactor } = quote;
        const { intval, useAdjClose } = this.formInputs;

        const msInDay = this.minutesPerInterval["daily"] * 60 * 1000;

        // Pre-calc timestamps once
        const startInput = this.start.getTime();
        const endInput = this.end.getTime();
        const startInData = new Date(date[0]).getTime();
        const endInData = new Date(date[date.length - 1]).getTime();

        const warnings: string[] = [];

        // Date discrepancy
        const allowedDrift = 5 * msInDay;
        const isFrequentTrading = !["monthly", "weekly"].includes(intval);
        if (
            isFrequentTrading &&
            (Math.abs(startInData - startInput) > allowedDrift ||
                Math.abs(endInData - endInput) > allowedDrift)
        ) {
            console.log
            warnings.push("Discrepancy between available data and selected dates. Stock may have IPO'd later or been delisted earlier.");
        }

        // EOD-specific checks
        if (this.isEOD) {
            if (volume.some(v => v < 1000)) {
                warnings.push("Low trading volume detected. This may cause volatility and unpredictability.");
            }
            if (!useAdjClose && splitFactor.some(s => s !== 1)) {
                warnings.push("Stock splits detected. This backtest is likely invalid. Consider using adjusted close prices.");
            }
        }

        return warnings;
    }

    private normalizeAndShortenData(quote: QuoteColumns) {
        const { date, high, low, open, close, volume, adjHigh, adjLow, adjOpen, adjClose, adjVolume } = quote; // WILL THIS ERROR??
        const closeToUse = this.useAdjusted ? adjClose : close;
        const highToUse = this.useAdjusted ? adjHigh : high;
        const lowToUse = this.useAdjusted ? adjLow : low;
        const openToUse = this.useAdjusted ? adjOpen : open;
        const volumeToUse = this.useAdjusted ? adjVolume : volume;

        // chop data after burn-in
        const shortenedIndex = date.findIndex(
            (ts) => new Date(ts).getTime() >= new Date(this.formInputs.startDate).getTime()
        );

        if (shortenedIndex === -1) throw new HttpError(400, "No data exists after the specified start timestamp.");

        const makeShort = (arr: any[]) => arr.slice(shortenedIndex);
        const shortened = {
            high: makeShort(highToUse),
            low: makeShort(lowToUse),
            open: makeShort(openToUse),
            close: makeShort(closeToUse),
            volume: makeShort(volumeToUse),
            date: makeShort(date),
        };

        const firstPrice = shortened.close[0];
        if (!firstPrice || typeof firstPrice !== "number" || isNaN(firstPrice)) {
            throw new HttpError(500, "Invalid first price for normalization.");
        }

        const normalize = (prices: number[]) =>
            prices.map((p) =>
                Math.round((p / firstPrice) * 10 ** this.decimalPlaces) /
                10 ** this.decimalPlaces
            );

        return {
            shortenedNormalizedQuote: {
                high: normalize(shortened.high),
                low: normalize(shortened.low),
                open: normalize(shortened.open),
                close: normalize(shortened.close),
                volume: shortened.volume,
                timestamp: shortened.date,
            },
            normalizedQuote: {
                high: normalize(high),
                low: normalize(low),
                open: normalize(open),
                close: normalize(close),
                volume,
                timestamp: date,
            },
        };
    }

    private static rowsToColumns(data: any[]): QuoteColumns {
        return data.reduce((acc, row) => {
            Object.entries(row).forEach(([key, val]) => {
                if (!acc[key]) acc[key] = [];
                acc[key].push(val);
            });
            return acc;
        }, {} as QuoteColumns);
    }
}

export default StockDataConnection;
