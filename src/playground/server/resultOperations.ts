import { HttpError } from "wasp/server";
import { type Result } from "wasp/entities";
import {
    type CreateResult,
    type RenameResult,
    type DeleteResult,
    type GetResults,
    type GetResultsForStrategy,
    type GetTopResults,
    type TogglePrivacy,
} from "wasp/server/operations";

type ResultCreationInfo = {
    name: string;
    code: string;
    data: any;
    formInputs: any;
    strategyId: string;

    timepoints: number;
    profitLoss: number;
    profitLossAnnualized: number;
};

export const createResult: CreateResult<ResultCreationInfo, Result> = async ({ name, code, data, formInputs, strategyId, profitLoss, profitLossAnnualized, timepoints }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    const existingResult = await context.entities.Result.findFirst({
        where: {
            name,
            user: { id: context.user.id },
        },
    });

    if (existingResult) {
        throw new HttpError(400, "A result with this name already exists.");
    }

    return await context.entities.Result.create({
        data: {
            name,
            code,
            data,
            formInputs,
            timepoints,
            profitLoss,
            profitLossAnnualized,
            user: {
                connect: { id: context.user.id },
            },
            fromStrategy: {
                connect: { id: strategyId },
            },
        },
    });
};

export const getResults: GetResults<void, Result[] | null> = async (_args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    const results = await context.entities.Result.findMany({
        where: {
            user: { id: context.user.id },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return results.length > 0 ? results : null;
};

export const getResultsForStrategy: GetResultsForStrategy<Pick<Result, "fromStrategyID">, Result[] | null> = async ({ fromStrategyID }, context) => {
    if (!context.user) {
        throw new HttpError(401)
    }

    return await context.entities.Result.findMany({
        where: {
            fromStrategyID,
            user: { id: context.user.id },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export type ResultWithUsername = Result & {
    email: string;
};

export type GetTopResultsProp = {
    topByProfitLoss: ResultWithUsername[] | null;
    topByAnnualizedProfitLoss: ResultWithUsername[] | null;
}

export const getTopResults: GetTopResults<void, GetTopResultsProp> = async (_args, context) => {
    const results = await context.entities.Result.findMany({
        where: { public: true },
        include: { user: true },
    });

    if (results.length === 0) {
        return { topByProfitLoss: null, topByAnnualizedProfitLoss: null };
    }

    // Map results to include email
    const resultsWithUsername = results.map((result: any) => ({
        ...result,
        email: result.user?.email,
    }));

    return {
        topByProfitLoss: resultsWithUsername
            .sort((a, b) => b.profitLoss - a.profitLoss)
            .slice(0, 10),
        topByAnnualizedProfitLoss: resultsWithUsername
            .sort((a, b) => b.profitLossAnnualized - a.profitLossAnnualized)
            .slice(0, 10),
    };
};


export const deleteResult: DeleteResult<Pick<Result, "id">, Result> = async ({ id }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    return await context.entities.Result.delete({
        where: {
            id,
            user: { id: context.user.id },
        },
    });
};

export const togglePrivacy: TogglePrivacy<Partial<Result>, Result> = async ({ id }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    // Fetch the current result to get its `public` value
    const result = await context.entities.Result.findUnique({
        where: {
            id,
            userId: context.user.id, // Assuming `userId` is the correct field
        },
        select: { public: true }, // Only fetch the `public` field
    });

    if (!result) {
        throw new HttpError(404, "Result not found.");
    }

    // Toggle the `public` boolean
    return await context.entities.Result.update({
        where: { id },
        data: { public: !result.public },
    });
};


export const renameResult: RenameResult<Partial<Result>, Result> = async ({ id, name }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    const existingResult = await context.entities.Result.findFirst({
        where: {
            name,
            user: { id: context.user.id },
        },
    });

    if (existingResult) {
        throw new HttpError(400, "A result with this name already exists.");
    }

    return await context.entities.Result.update({
        where: {
            id,
        },
        data: {
            name,
        },
    });
};
