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
} from 'wasp/server/operations';

type FileCreationInfo = {
  name: string;
  code: string;
};

export const createStrategy: CreateStrategy<FileCreationInfo, Strategy> = async ({ name, code }, context) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Strategy.create({
    data: { name, code, user: { connect: { id: context.user.id } }, },
  });
};

export const getStrategies: GetStrategies<void, Strategy[]> = async (_args, context) => {
  if (!context.user) throw new HttpError(401);

  return context.entities.Strategy.findMany({
    where: { user: { id: context.user.id, }, },
    orderBy: { updatedAt: 'desc', },
  });
};


//to come: getSpecificStrategy
export const getSpecificStrategy: GetSpecificStrategy<Pick<Strategy, 'id'>, Strategy> = async ({ id }, context) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Strategy.findUnique({
    where: { id, },
  });
};

export const deleteStrategy: DeleteStrategy<Pick<Strategy, 'id'>, Strategy> = async ({ id }, context) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Strategy.delete({
    where: { id, },
  });
};


export const renameStrategy: RenameStrategy<Partial<Strategy>, Strategy> = async ({ id, name }, context) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Strategy.update({
    where: { id, },
    data: { name, },
  });
};


export const updateStrategy: UpdateStrategy<Partial<Strategy>, Strategy> = async ({ id, code }, context) => {
  if (!context.user) throw new HttpError(401);

  return await context.entities.Strategy.update({
    where: { id, },
    data: { code, },
  });
};


export const charge: Charge<void, void> = async (_args, context) => {

  if (!context.user) throw new HttpError(401);

  if (!context.user.credits && context.user.subscriptionPlan !== "active" && !context.user.isAdmin) {
      await context.entities.User.update({
          where: { id: context.user.id },
          data: {
              credits: {
                  decrement: 1,
              },
          },
      });
  }
}