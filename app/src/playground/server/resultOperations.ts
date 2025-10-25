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
import {
  StatProps,
  StrategyResultProps,
  ResultWithStrategyName,
  ResultWithUsername,
  GetTopResultsProp,
} from "../../shared/sharedTypes";

// unfortunately, we must leave data, forminputs,
// and stats as "any" because superJSON otherwise
// doesn't trust they are serializable. Will look for a workaround!
type ResultCreationInfo = {
  name: string;
  code: string;
  data: any;
  formInputs: any;
  strategyId: string;
  stats: any;
};

export const createResult: CreateResult<ResultCreationInfo, Result> = async (
  { name, code, data, formInputs, strategyId, stats },
  context
) => {
  if (!context.user) throw new HttpError(401);

  const existingResult = await context.entities.Result.findFirst({
    where: {
      name,
      user: { id: context.user.id },
    },
  });

  if (existingResult) {
    throw new HttpError(400, "A result with this name already exists.");
  }

  // break down data into arrays
  const {
    timestamp,
    open,
    close,
    high,
    low,
    volume,
    signal,
    returns,
    sp,
    portfolio,
    portfolioWithCosts,
    cash,
    equity,
    cashWithCosts,
    equityWithCosts,
    userDefinedData,
  }: StrategyResultProps = data;
  const {
    length,
    pl,
    plWCosts,
    cagr,
    numTrades,
    numProfTrades,
    percTradesProf,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown,
    maxGain,
    meanReturn,
    stddevReturn,
    maxReturn,
    minReturn,
  }: StatProps = stats;

  return await context.entities.Result.create({
    data: {
      name,
      code,

      timestamp,
      open,
      close,
      high,
      low,
      volume,
      signal,
      returns,
      sp,
      portfolio,
      portfolioWithCosts,
      cash,
      equity,
      cashWithCosts,
      equityWithCosts,
      userDefinedData,
      formInputs,

      length,
      pl,
      plWCosts,
      cagr,
      numTrades,
      numProfTrades,
      percTradesProf,
      sharpeRatio,
      sortinoRatio,
      maxDrawdown,
      maxGain,
      meanReturn,
      stddevReturn,
      maxReturn,
      minReturn,

      user: {
        connect: { id: context.user.id },
      },

      fromStrategy: {
        connect: { id: strategyId },
      },
    },
  });
};

export const getResults: GetResults<
  void,
  ResultWithStrategyName[] | null
> = async (_args, context) => {
  if (!context.user) throw new HttpError(401);

  const results = await context.entities.Result.findMany({
    where: {
      user: { id: context.user.id },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { fromStrategy: true },
  });

  const resultsWithStrategyName: ResultWithStrategyName[] = results.map(
    ({ fromStrategy, ...rest }) => ({
      ...rest,
      strategyName: fromStrategy?.name ?? "",
    })
  );

  return resultsWithStrategyName.length > 0 ? resultsWithStrategyName : null;
};

export const getResultsForStrategy: GetResultsForStrategy<
  Pick<Result, "fromStrategyID">,
  Result[] | null
> = async ({ fromStrategyID }, context) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Result.findMany({
    where: {
      fromStrategyID,
      user: { id: context.user.id },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTopResults: GetTopResults<void, GetTopResultsProp> = async (
  _args,
  context
) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const results = await context.entities.Result.findMany({
    where: {
      public: true,
      length: { gte: 15 },
      createdAt: { gte: oneWeekAgo },
      pl: { not: null },
      cagr: { not: null },
    },
    include: { user: true },
  });

  if (results.length === 0) {
    return { topByProfitLoss: null, topByAnnualizedProfitLoss: null };
  }

  const resultsWithUsername: ResultWithUsername[] = results.map(
    ({ user, ...rest }) => ({
      ...rest,
      code: "obfuscated for privacy.",
      email: user?.email ? user.email.split("@")[0] : "",
    })
  );

  const toReturn: GetTopResultsProp = {
    topByProfitLoss: resultsWithUsername
      .sort((a, b) => (b.pl ?? 0) - (a.pl ?? 0))
      .slice(0, 10),
    topByAnnualizedProfitLoss: resultsWithUsername
      .sort((a, b) => (b.cagr ?? 0) - (a.cagr ?? 0))
      .slice(0, 10),
  };

  return toReturn;
};

export const deleteResult: DeleteResult<Pick<Result, "id">, Result> = async (
  { id },
  context
) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Result.delete({
    where: {
      id,
      user: { id: context.user.id },
    },
  });
};

export const togglePrivacy: TogglePrivacy<Partial<Result>, Result> = async (
  { id },
  context
) => {
  if (!context.user) throw new HttpError(401);

  // Fetch the current result to get its `public` value
  const result = await context.entities.Result.findUnique({
    where: {
      id,
      userId: context.user.id,
    },
    select: { public: true },
  });

  if (!result) {
    throw new HttpError(404, "Result not found.");
  }

  // Toggle the `public` boolean
  return await context.entities.Result.update({
    where: {
      id,
    },
    data: { public: !result.public },
  });
};

export const renameResult: RenameResult<Partial<Result>, Result> = async (
  { id, name },
  context
) => {
  if (!context.user) throw new HttpError(401);

  const existingResult = await context.entities.Result.findFirst({
    where: {
      name,
      user: { id: context.user.id },
    },
  });

  if (existingResult && existingResult.id !== id) {
    throw new HttpError(400, "A result with this name already exists.");
  }
  if (existingResult && existingResult.id === id) {
    throw new HttpError(
      400,
      "The new result name must be different from the current name."
    );
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
