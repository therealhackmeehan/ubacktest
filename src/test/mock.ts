import {
    type Strategy,
    type User,
    type Result,
    type Share,
} from "wasp/entities";

import { initFormInputs } from "../playground/client/components/initFormInputs";
import { GetSharedProps } from "../shared/sharedTypes";

export const mockStrategy: Strategy =
{
    id: '12345',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "strategy_1",
    userId: '54321',
    code: "print('hi')"
};

export const mockUser: User = {
    id: '54321',
    createdAt: new Date(),

    email: 'test@example.com',
    username: 'testuser',
    lastActiveTimestamp: new Date(),
    isAdmin: false,

    paymentProcessorUserId: 'stripe_123',
    checkoutSessionId: 'cs_test_123',
    subscriptionStatus: 'active',
    subscriptionPlan: 'pro',
    sendNewsletter: true,
    datePaid: new Date(),
    credits: 10,
};

export const mockResult: Result = {
    id: 'res123',
    createdAt: new Date(),

    userId: mockUser.id,

    name: 'result_1',
    code: 'print("Hello World")',

    public: true,

    fromStrategyID: mockStrategy.id,

    length: 100,
    pl: 20,
    plWCosts: 1400.00,
    cagr: 10,
    numTrades: 20,
    numProfTrades: 12,
    percTradesProf: 0.6,
    sharpeRatio: 1.2,
    sortinoRatio: 1.5,
    maxDrawdown: -0.25,
    maxGain: 0.35,
    meanReturn: 0.01,
    stddevReturn: 0.02,
    maxReturn: 0.05,
    minReturn: -0.03,

    timestamp: Array.from({ length: 100 }, (_, i) =>
        new Date(2020, 0, 1 + i).toISOString().split("T")[0]
    ),
    open: Array.from({ length: 100 }, () => Math.random() * 100),
    close: Array.from({ length: 100 }, () => Math.random() * 100),
    high: Array.from({ length: 100 }, () => Math.random() * 100),
    low: Array.from({ length: 100 }, () => Math.random() * 100),
    volume: Array.from({ length: 100 }, () => Math.random() * 10000),
    signal: Array.from({ length: 100 }, () => [-1, 0, 1][Math.floor(Math.random() * 3)]),
    returns: Array.from({ length: 100 }, () => Math.random() * 0.02 - 0.01),
    sp: Array.from({ length: 100 }, () => Math.random() * 1000),
    portfolio: Array.from({ length: 100 }, () => 10000 + Math.random() * 1000),
    portfolioWithCosts: Array.from({ length: 100 }, () => 9800 + Math.random() * 1000),
    cash: Array.from({ length: 100 }, () => Math.random() * 10000),
    equity: Array.from({ length: 100 }, () => Math.random() * 10000),
    cashWithCosts: Array.from({ length: 100 }, () => Math.random() * 9500),
    equityWithCosts: Array.from({ length: 100 }, () => Math.random() * 9500),
    userDefinedData: null,

    formInputs: initFormInputs as any,
};

const sender = { ...mockUser, email: 'sender@gmail.com' };
const receiver = { ...mockUser, email: 'receiver@gmail.com' };
export const mockShare: Share = {
    id: 'share123',
    sharedAt: new Date(),

    // user: sender,
    userID: sender.id,

    // receiver: receiver.id,
    receiverID: receiver.id,

    // result: mockResult,
    resultID: mockResult.id,

    accepted: false,
}

export const mockSharedResult: GetSharedProps = {
    ...mockResult,
    sharedID: mockStrategy.id,
    email: mockUser.email as string,
    accepted: false
}