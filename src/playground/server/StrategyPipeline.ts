import { StrategyResultProps, FormInputProps } from "../../shared/sharedTypes";
import CodeExecutor from "./CodeExecutor";
import ScriptBuilder from "./ScriptBuilder";
import ResultValidator from "./ResultValidator";
import STDParser from "./STDParser";
import PortfolioCalculator from "./PortfolioCalculator";
import APIDataConnector from "./APIDataConnector";
import { StatProps } from "../../shared/sharedTypes";
/*
    Main backend endpoint for processing of the stock trading strategy.
    Will search for data and apply the given python strategy.

    Returns some debug output, any warnings to display, and the JSON data
    describing the result of the strategy.

    (c) Jack Meehan 2025, uBacktest.com
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
        portfolio: [],
        portfolioWithCosts: [],
        cash: [],
        equity: [],
        equityWithCosts: [],
        cashWithCosts: [],
        sp: [],
        signal: [],
        returns: [],
        userDefinedData: {},
    };

    private statistics: StatProps = {
        length: 0,
        pl: null,
        plWCosts: null,
        cagr: null,
        numTrades: 0,
        numProfTrades: 0,
        percTradesProf: null,
        sharpeRatio: null,
        sortinoRatio: null,
        maxDrawdown: null,
        maxGain: null,
        meanReturn: null,
        stddevReturn: null,
        maxReturn: null,
        minReturn: null,
    }

    // store code execution outputs
    private stderr: string = '';
    private stdout: string = '';
    private warning: string[] = [];

    constructor(formInputs: FormInputProps, code: string) {
        this.formInputs = formInputs;
        this.code = code;
    }

    //________________________________________ run: main endpoint
    public async run() {

        // Initialize our Stock API Connection
        const apiConnection = new APIDataConnector(this.formInputs);

        // Fetch stock data
        const symbol = this.formInputs.symbol;
        const { normalizedQuote, shortenedNormalizedQuote, warning } = await apiConnection.get(symbol);

        this.warning = warning;
        this.strategyResult = {
            ...this.strategyResult,
            ...shortenedNormalizedQuote
        };

        // Generate a unique key; surround stdout in this private key
        const key = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
        const fullUserCode = ScriptBuilder.build(this.code, normalizedQuote, this.formInputs.startDate, key);

        // Execute user code
        const { stdout_raw, stderr_raw } = await new CodeExecutor(fullUserCode, this.formInputs.timeout).execute();

        // Parse execution output
        const parsedOutput = new STDParser(stdout_raw, stderr_raw, key).parse();
        this.stdout = parsedOutput.stdout;
        this.stderr = parsedOutput.stderr;
        this.strategyResult.signal = parsedOutput.signal;
        this.strategyResult.userDefinedData = parsedOutput.userDefinedData;

        // If there's an error, return early
        if (this.stderr) return this.sendJSONtoFrontend();

        // Try to add S&P 500 data for comparison
        try {
            const { shortenedNormalizedQuote } = await apiConnection.get('^GSPC');
            if (StrategyPipeline.arraysAreEqual(this.strategyResult.timestamp, shortenedNormalizedQuote.timestamp)) {
                this.strategyResult.sp = shortenedNormalizedQuote.close;
            }
        } catch (Error: any) {
            this.warning.push("An issue occurred with fetching S&P Comparison Data, so it will be excluded from this backtest.");
        }

        // Calculate final portfolio results
        const calc = new PortfolioCalculator(this.formInputs.costPerTrade, this.strategyResult);
        this.strategyResult = calc.calculate();

        ResultValidator.validatePortfolio(this.strategyResult);
        this.statistics = calc.statistics();

        return this.sendJSONtoFrontend();
    }

    //________________________________________

    private sendJSONtoFrontend() {
        return {
            strategyResult: this.strategyResult,
            statistics: this.statistics,
            debugOutput: this.stdout,
            stderr: this.stderr,
            warnings: [...new Set(this.warning)],
        }
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
