import { HttpError } from 'wasp/server';
import { type Strategy } from 'wasp/entities';
import {
  type CreateStrategy,
  type UpdateStrategy,
  type DeleteStrategy,
  type GetStrategies,
  type RenameStrategy,
  type GetSpecificStrategy,
  type Charge,
  type Uncharge,
  type RunStrategy,
} from 'wasp/server/operations';
import { StrategyResultProps } from '../../shared/sharedTypes';
import StrategyPipeline from './StrategyPipeline';

type FileCreationInfo = {
  name: string;
  code: string;
};

export const createStrategy: CreateStrategy<FileCreationInfo, Strategy> = async ({ name, code }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const existingStrategy = await context.entities.Strategy.findFirst({
    where: {
      name,
      user: { id: context.user.id },
    },
  });

  if (existingStrategy) {
    throw new HttpError(400, "A strategy with this name already exists.");
  }

  return await context.entities.Strategy.create({
    data: {
      name,
      code,
      user: { connect: { id: context.user.id } },
    },
  });
};

export const getStrategies: GetStrategies<void, Strategy[] | null> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const strategies = await context.entities.Strategy.findMany({
    where: {
      user: { id: context.user.id },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return strategies.length > 0 ? strategies : null;
};

export const getSpecificStrategy: GetSpecificStrategy<Pick<Strategy, 'id'>, Strategy | null> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const strategy = await context.entities.Strategy.findUnique({
    where: {
      id,
      user: { id: context.user.id }
    },
  });

  return strategy || null;
};


export const deleteStrategy: DeleteStrategy<Pick<Strategy, 'id'>, Strategy> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return await context.entities.Strategy.delete({
    where: {
      id,
      user: { id: context.user.id }
    },
  });
};

export const renameStrategy: RenameStrategy<Partial<Strategy>, Strategy> = async ({ id, name }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (name) {
    const existingStrategy = await context.entities.Strategy.findFirst({
      where: {
        name,
        user: { id: context.user.id },
      },
    });

    if (existingStrategy) {
      throw new HttpError(400, "A strategy with this name already exists.");
    }
  }

  return await context.entities.Strategy.update({
    where: {
      id,
      user: { id: context.user.id }
    },
    data: { name },
  });
};

export const updateStrategy: UpdateStrategy<Partial<Strategy>, Strategy> = async ({ id, code }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return await context.entities.Strategy.update({
    where: {
      id,
      user: { id: context.user.id }
    },
    data: { code },
  });
};

interface BacktestResultProps {
  strategyResult: StrategyResultProps;
  debugOutput: string;
  stderr: string;
  warnings: string[];
};

let isProcessing = false;
const delay = 1000; // 1 second delay between execution (rate-limiting)

export const runStrategy: RunStrategy<any, any> = async ({ formInputs, code }, context): Promise<BacktestResultProps> => {

  if (!context.user) throw new HttpError(401);

  if (!context.user.isAdmin) { // charge/make sure subscription is valid prior to running!
    const isProUser = context.user.subscriptionPlan == "pro";
    const proOnlyFormInputs = ['1m', '2m', '5m', '15m', '30m', '1h', '90m'];

    if (proOnlyFormInputs.includes(formInputs.intval) && !isProUser) {
      throw new HttpError(402, "High frequency backtesting is only available to pro users. Consider upgrading to a pro subscription.")
    }

    if (!context.user.credits && !context.user.subscriptionPlan) {
      throw new HttpError(402, "You must add more credits or purchase a basic monthly subscription to continue to use this software.");
    }
  }

  if (isProcessing) {
    throw new HttpError(429, "Please wait before running another strategy.");
  }

  isProcessing = true;

  try {
    const strategyInstance = new StrategyPipeline(formInputs, code);
    return await strategyInstance.run();
  } finally {
    setTimeout(() => {
      isProcessing = false;
    }, delay);
  }
};

export const charge: Charge<void, void> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  if (context.user.isAdmin) {
    console.log('Avoiding charge as admin.');
    return;
  }

  if (context.user.credits) {
    await context.entities.User.update({
      where: { id: context.user.id },
      data: { credits: { decrement: 1 } }, // for now increment while testing
    });
  }
};

export const uncharge: Uncharge<void, void> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  if (context.user.isAdmin) {
    console.log('Avoiding uncharge charge as admin.');
    return;
  }

  if (context.user.credits) {
    await context.entities.User.update({
      where: { id: context.user.id },
      data: { credits: { increment: 1 } }, // for now increment while testing
    });
  }
};
