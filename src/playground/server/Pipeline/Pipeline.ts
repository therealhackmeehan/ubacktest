import getStockData from "./getStockData";
import validateStockData from "./validation/validateStockData";
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
    const data = validateStockData({ stockData: rawStockData });

    // STEP 2 - RUN PYTHON CODE (w/ above stock data)
    return await runPythonCode({ data, code });
};