import getStockData from "./getStockData";
import validateStockData from "./validation/validateStockData";
import validateErrPrint from "./validation/validateErrPrint";
import validateStrategyResult from "./validation/validateStrategyResult";
import calculatePortfolio from "./calculations"
import runPythonCode from "./runPythonCode";

import type { RunStrategy } from "wasp/server/operations";
import { HttpError } from "wasp/server";

type PipelineProps = {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
    code: string;
};

type BacktestResultProps = {
    data: any;
    debugOutput: string;
    stderr: string;
};

export const runStrategy: RunStrategy<PipelineProps, BacktestResultProps> = async ({ symbol, startDate, endDate, intval, code }, context) => {

    if (!context.user) throw new HttpError(401);

    if (!context.user.credits && context.user.subscriptionPlan !== "active" && !context.user.isAdmin) {
        throw new HttpError(402, "You must add more credits or purchase an basic monthy subscription to use this software.");
    }

    //STEP 1 - GET STOCK DATA
    const rawStockData = await getStockData({ symbol, startDate, endDate, intval });
    let data = validateStockData({ stockData: rawStockData });

    // STEP 2 - RUN PYTHON CODE (w/ above stock data)
    let { signal, debugOutput, stderr } = await runPythonCode({ data, code });

    // STEP 3 - PROCESS DATA FOR RESULTS PANEL (if no stderr)
    if (!stderr && signal) {
        data.signal = signal;
        data.portfolio = calculatePortfolio(data);
        validateStrategyResult({ data });
    } else {
        stderr = validateErrPrint({ err: stderr });
    }

    return { data, debugOutput, stderr };

};