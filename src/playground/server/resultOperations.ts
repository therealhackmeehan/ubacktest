import { HttpError } from "wasp/server";
import { type Result } from "wasp/entities";
import {
    type CreateResult,
    type RenameResult,
    type DeleteResult,
    type GetResults,
    type GetResultsForStrategy,
} from "wasp/server/operations";

type ResultCreationInfo = {
    name: string;
    code: string;
    data: any;
    formInputs: any;
    strategyId: string;
};

export const createResult: CreateResult<ResultCreationInfo, Result> = async ({ name, code, data, formInputs, strategyId }, context) => {
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
            user: {
                id: context.user.id,
            },
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
    });
}

export const deleteResult: DeleteResult<Pick<Result, "id">, Result> = async ({ id }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    return await context.entities.Result.delete({
        where: {
            id,
        },
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
