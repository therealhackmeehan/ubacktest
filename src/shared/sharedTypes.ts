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
}

export interface FormInputProps {
    symbol: string;
    startDate: Date;
    endDate: Date;
    intval: string;
    timeOfDay: "open" | "close" | "high" | "low";
    costPerTrade: number;
}