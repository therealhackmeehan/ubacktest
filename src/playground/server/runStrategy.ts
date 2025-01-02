import StrategyPipeline from "./StrategyPipeline";
import type { RunStrategy } from "wasp/server/operations";
import { HttpError } from "wasp/server";
import { StrategyResultProps } from "../../shared/sharedTypes";

type BacktestResultProps = {
    strategyResult: StrategyResultProps;
    debugOutput: string;
    stderr: string;
    warning: string[];
};

export const runStrategy: RunStrategy<any, any> = async ({ formInputs, code }, context): Promise<BacktestResultProps> => {
    if (!context.user) throw new HttpError(401);

    if (!context.user.credits && context.user.subscriptionPlan !== "active" && !context.user.isAdmin) {
        throw new HttpError(402, "You must add more credits or purchase an basic monthy subscription to use this software.");
    }

    const strategyInstance = new StrategyPipeline(formInputs, code);
    return await strategyInstance.run();

};