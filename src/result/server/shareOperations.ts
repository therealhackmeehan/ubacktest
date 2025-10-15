import { HttpError } from "wasp/server";
import { type Share, type User, type Result } from "wasp/entities";
import {
  ShareResultProps,
  GetSharedProps,
  SharedWithResultAndUser,
} from "../../shared/sharedTypes";
import {
  type ShareResult,
  type GetShared,
  type AcceptShare,
  type DeleteShare,
  type GetSharedWith,
} from "wasp/server/operations";
import { emailSender } from "wasp/server/email";

export const shareResult: ShareResult<ShareResultProps, Share> = async (
  { email, resultID },
  context
) => {
  if (!context.user) throw new HttpError(401);

  if (!email) throw new HttpError(400, "Email input must be nonempty.");

  const recipient = await context.entities.User.findUnique({
    where: { email },
  });

  if (!recipient) {
    throw new HttpError(
      400,
      "We could not find that user in our database. Make sure you have their email spelled and entered correctly."
    );
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
    throw new HttpError(
      400,
      "You have already shared the result with this user."
    );
  }

  await emailSender.send({
    from: {
      name: "uBacktest Support",
      email: "john@uBacktest.com",
    },
    to: email,
    subject: `${context.user.email} has Shared a Strategy Result!.`,
    text: `Someone shared a trading strategy with you!

Click the link below to view it:
https://uBacktest.com/results

Happy trading!`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <img src="../../client/static/logo.png" alt="uBacktest Logo" style="width: 120px; margin-bottom: 20px;" />
      <h2 style="color: #333;">You've received a trading strategy</h2>
      <p style="font-size: 16px; color: #555;">
        Someone thought you'd appreciate this strategy result. You can either accept or deny this share request. Click the link below to check it out:
      </p>
      <a href="https://uBacktest.com/results" 
         style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">
         View Result
      </a>
      <p style="font-size: 14px; color: #999; margin-top: 30px;">
        If you have any questions or feedback, just hit reply to this email.
      </p>
    </div>
  `,
  });

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
};

export const getSharedWith: GetSharedWith<Pick<Result, "id">, Share[]> = async (
  { id },
  context
) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Share.findMany({
    where: {
      userID: context.user.id,
      resultID: id,
    },
    include: {
      receiver: true,
    },
  });
};

export const getShared: GetShared<void, GetSharedProps[] | null> = async (
  _args,
  context
) => {
  if (!context.user) throw new HttpError(401);

  const shared = await context.entities.Share.findMany({
    where: {
      receiver: { id: context.user.id },
    },
    include: {
      result: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      sharedAt: "desc",
    },
  });

  // Transform shared results into GetSharedProps
  const results: GetSharedProps[] = shared.flatMap(
    (share: SharedWithResultAndUser) => {
      if (!share.result) return [];

      const { user, ...resultWithoutUser } = share.result;

      return [
        {
          ...resultWithoutUser,
          sharedID: share.id,
          email: user?.email ?? "Unknown",
          accepted: share.accepted,
        },
      ];
    }
  );

  return results.length > 0 ? results : null;
};

export const acceptShare: AcceptShare<Pick<Share, "id">, Share> = async (
  { id },
  context
) => {
  if (!context.user) throw new HttpError(401);

  const share = await context.entities.Share.findFirst({
    where: {
      id,
      receiver: { id: context.user.id },
    },
  });

  if (!share) throw new HttpError(400, "Could not find that share to accept.");

  return await context.entities.Share.update({
    where: {
      id,
      receiver: { id: context.user.id },
    },
    data: { accepted: true },
  });
};

export const deleteShare: DeleteShare<Pick<Share, "id">, Share> = async (
  { id },
  context
) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Share.delete({
    where: {
      id,
      OR: [
        { user: { id: context.user.id } },
        { receiver: { id: context.user.id } },
      ],
    },
  });
};
