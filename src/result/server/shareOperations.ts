import { HttpError } from "wasp/server";
import { type Share } from "wasp/entities";
import { ShareResultProps, GetSharedProps } from "../../shared/sharedTypes";
import {
    type ShareResult,
    type GetShared,
    type AcceptShare,
    type DeleteShare
} from "wasp/server/operations";

export const shareResult: ShareResult<ShareResultProps, Share> = async ({ email, resultID }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    if (!email) throw new HttpError(400, "Email inptu must be nonempty.");

    const recipient = await context.entities.User.findUnique({
        where: { email, },
    });

    if (!recipient) {
        throw new HttpError(400, "We could not find that user in our database. Make sure you have their email spelled and entered correctly.")
    }
    if (recipient.id == context.user.id) {
        throw new HttpError(400, "You cannot share a strategy with yourself.");
    }

    const existingShare = await context.entities.Share.findFirst({
        where: {
            user: { id: context.user.id },
            receiver: { id: recipient.id },
            result: { id: resultID },
        },
    });

    // keep an eye on this... Somehow it made it through one time?
    if (existingShare) {
        throw new HttpError(400, "You have already shared the result with this user.")
    }

    return await context.entities.Share.create({
        data: {
            user: {
                connect: { id: context.user.id },
            },
            receiver: {
                connect: { id: recipient.id },
            },
            result: {
                connect: { id: resultID },
            },
        },
    });
}

export const getShared: GetShared<void, GetSharedProps[] | null> = async (_args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    const shared = await context.entities.Share.findMany({
        where: {
            receiver: { id: context.user.id },
        },
        include: {
            result: {
                include: {
                    user: true, // Assuming 'user' is the relation from Result to User
                },
            },
        },
        orderBy: {
            sharedAt: "desc",
        },
    });

    // Transform shared results into GetSharedProps
    const results: GetSharedProps[] = shared.flatMap((share: any) => {
        if (!share.result) return [];

        const { user, ...resultWithoutUser } = share.result;

        return [{
            ...resultWithoutUser,
            sharedID: share.id,
            email: user?.email ?? "Unknown",
            accepted: share.accepted,
        }];
    });

    return results.length > 0 ? results : null;
};

export const acceptShare: AcceptShare<Pick<Share, "id">, Share> = async ({ id }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    const share = await context.entities.Share.findFirst({
        where: {
            id,
            receiver: { id: context.user.id },
        },
    });

    if (!share) {
        throw new HttpError(400, "Could not find that share to accept.");
    }

    return await context.entities.Share.update({
        where: {
            id,
            receiver: { id: context.user.id },
        },
        data: { accepted: true },
    })
}

export const deleteShare: DeleteShare<Pick<Share, "id">, Share> = async ({ id }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    return await context.entities.Share.delete({
        where: {
            id,
            OR: [
                { user: { id: context.user.id } },
                { receiver: { id: context.user.id } }
            ]
        },
    });
};