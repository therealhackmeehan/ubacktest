import { type MonthlyCreditReset } from "wasp/server/jobs";

export const monthlyCreditReset: MonthlyCreditReset<{}, number> = async (
  _args,
  context
) => {
  const updatedUsers = await context.entities.User.updateMany({
    where: {
      credits: { lte: 3 },
    },
    data: { credits: 3 },
  });

  console.log("Updated all free user credits.");

  return updatedUsers.count;
};
