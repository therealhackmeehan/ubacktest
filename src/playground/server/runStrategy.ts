import StrategyPipeline from "./StrategyPipeline";
import type { RunStrategy } from "wasp/server/operations";
import { HttpError } from "wasp/server";

type BacktestResultProps = {
    data: any;
    debugOutput: string;
    stderr: string;
};

export const runStrategy: RunStrategy<any, BacktestResultProps> = async ({ formInputs, code }, context) => {
    if (!context.user) throw new HttpError(401);

    if (!context.user.credits && context.user.subscriptionPlan !== "active" && !context.user.isAdmin) {
        throw new HttpError(402, "You must add more credits or purchase an basic monthy subscription to use this software.");
    }

    const strategyInstance = new StrategyPipeline(formInputs, code);
    return strategyInstance.go();

};