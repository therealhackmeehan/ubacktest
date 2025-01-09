import type { RunCodeGeneration } from "wasp/server/operations";
import { HttpError } from "wasp/server";
import CodeGenerator from './CodeGenerator'

export const runCodeGeneration: RunCodeGeneration<any, any> = async ({ code }, context): Promise<string> => {
    if (!context.user) throw new HttpError(401);

    if (!context.user.credits && context.user.subscriptionPlan !== "active" && !context.user.isAdmin) {
        throw new HttpError(402, "You must add more credits or purchase an basic monthy subscription to use this software.");
    }

    const codeGenerationInstance = new CodeGenerator(code);
    return await codeGenerationInstance.generate();

};