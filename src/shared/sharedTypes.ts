interface UserDefinedData {
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

    userDefinedData: UserDefinedData;
}

export interface FormInputProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
    timeOfDay: "open" | "close" | "high" | "low";
    costPerTrade: number;
    useWarmupDate: boolean;
    warmupDate: string | null;
}