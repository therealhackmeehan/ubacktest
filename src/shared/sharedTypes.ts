import {
    type Result,
    type User,
    type Share
} from "wasp/entities";

export interface UserDefinedData {
    [key: string]: number[]; // The key can be any string, and the value is an array of numbers.
}

export interface StrategyResultProps {
    timestamp: number[];
    open: number[];
    close: number[];
    high: number[];
    low: number[];
    volume: number[];

    signal: number[];
    returns: number[];

    sp: number[];

    portfolio: number[];
    portfolioWithCosts: number[];

    cash: number[];
    equity: number[];

    cashWithCosts: number[]
    equityWithCosts: number[]

    userDefinedData: UserDefinedData;
}

export interface FormInputProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
    timeout: number;
    costPerTrade: number;
    useWarmupDate: boolean;
    warmupDate: string;
}

export interface PythonDataProps {
    timestamp: number[],
    open: number[],
    close: number[],
    high: number[],
    low: number[],
    volume: number[],
}

export interface StatProps {
    length: number;
    pl: number | null;
    plWCosts: number | null;
    cagr: number | null;
    numTrades: number;
    numProfTrades: number;
    percTradesProf: number | null;
    sharpeRatio: number | null;
    sortinoRatio: number | null;
    maxDrawdown: number | null;
    maxGain: number | null;
    meanReturn: number | null;
    stddevReturn: number | null;
    maxReturn: number | null;
    minReturn: number | null;
}

export type ShareResultProps = {
    email: User["email"];
    resultID: Result["id"];
};

export type GetSharedProps = Result & {
    sharedID: string;
    email: string;
    accepted: boolean;
};

export interface BacktestResultProps {
  strategyResult: StrategyResultProps;
  statistics: StatProps;
  debugOutput: string;
  stderr: string;
  warnings: string[];
};

export type ResultWithStrategyName = Result & {
    strategyName: string;
};

export type ResultWithUsername = Result & {
    email: string;
};

export type GetSharedWithWithReceiver = Share & {
    receiver: User;
}

export type GetTopResultsProp = {
    topByProfitLoss: ResultWithUsername[] | null;
    topByAnnualizedProfitLoss: ResultWithUsername[] | null;
}

export interface stdProps {
    out: string;
    err: string;
}