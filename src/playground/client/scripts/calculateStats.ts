import { StrategyResultProps } from "../../../shared/sharedTypes";

export interface StatProps {
    length: number;
    pl: string | null;
    plWCosts: string | null;
    annualizedPl: string | null;
    numTrades: number;
    numProfTrades: number;
    percTradesProfit: string | null;
    sharpeRatio: string | null;
    sortinoRatio: string | null;
    maxDrawdown: string | null;
    maxGain: string | null;
    meanReturn: string | null;
    stddevReturn: string | null;
    maxReturn: string | null;
    minReturn: string | null;
}

export default function calculateStats(strategyResult: StrategyResultProps): StatProps {
    const length = strategyResult.portfolio.length - 1;

    // Calculate total profit/loss
    const totalPL = (strategyResult.portfolio[length] - strategyResult.portfolio[0]) / strategyResult.portfolio[0];
    const formattedTotalPL = totalPL !== null ? (100 * totalPL).toFixed(2) + '%' : null;

    const totalPLWCosts = (strategyResult.portfolioWithCosts[length] - strategyResult.portfolioWithCosts[0]) / strategyResult.portfolio[0];
    const formattedTotalPLWCosts = totalPLWCosts !== null ? (100 * totalPLWCosts).toFixed(2) + '%' : null;

    // Convert Unix timestamps to JavaScript Date objects
    const firstDate = new Date(strategyResult.timestamp[0] * 1000).getTime();
    const lastDate = new Date(strategyResult.timestamp[length] * 1000).getTime();

    const numberOfDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const annualizedPL = ((1 + totalPL) ** (365 / numberOfDays)) - 1;
    const formattedAnnualizedPL = annualizedPL !== null ? (annualizedPL * 100).toFixed(2) + '%' : null;

    let numberOfTrades = 1;
    let numberOfProfitableTrades = 0;
    let peak = strategyResult.portfolio[0];
    let maxDrawdown = 0;

    let buyPrice = strategyResult.portfolio[0];

    for (let i = 1; i < length; i++) {
        if (strategyResult.signal[i] !== strategyResult.signal[i - 1]) {
            numberOfTrades++;

            if (strategyResult.portfolio[i] > buyPrice) {
                numberOfProfitableTrades++;
            }

            buyPrice = strategyResult.portfolio[i];
        }

        if (strategyResult.portfolio[i] > peak) {
            peak = strategyResult.portfolio[i];
        }

        const drawdown = (peak - strategyResult.portfolio[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    const formattedMaxDrawdown = maxDrawdown !== null ? (maxDrawdown * 100).toFixed(2) + '%' : null;

    const maxGain = Math.max.apply(Math, strategyResult.portfolio) - 1;
    const formattedMaxGain = maxGain !== null ? (maxGain * 100).toFixed(2) + '%' : null;
    const returns = strategyResult.returns;

    // Initialize variables for sum, max, min
    let sum = 0;
    let max = -Infinity;
    let min = Infinity;

    // First pass: calculate sum, max, and min
    for (const ret of returns) {
        sum += ret;
        if (ret > max) max = ret;
        if (ret < min) min = ret;
    }

    // Calculate average return
    const averageReturn = sum / returns.length;

    // Second pass: calculate variance
    const variance =
        returns.reduce((sum: number, ret: number) => sum + Math.pow(ret - averageReturn, 2), 0) /
        (returns.length - 1);
    const stdDev = Math.sqrt(variance);

    // Format values
    const formattedAvgReturn = averageReturn !== null ? (100 * averageReturn).toPrecision(2) : null;
    const formattedStdReturn = stdDev !== null ? (100 * stdDev).toPrecision(2) : null;
    const formattedMax = max !== null ? (100 * max).toPrecision(2) : null;
    const formattedMin = min !== null ? (100 * min).toPrecision(2) : null;

    const negativeReturns = returns.filter((ret: number) => ret < 0);
    const downsideVariance =
        negativeReturns.reduce((sum: number, ret: number) => sum + Math.pow(ret, 2), 0) /
        (negativeReturns.length || 1);
    const downsideDev = Math.sqrt(downsideVariance);

    const riskFreeRate = 0;

    const sharpeRatio = (averageReturn - riskFreeRate) / stdDev;
    const roundedSharpeRatio = sharpeRatio !== null ? sharpeRatio.toFixed(2) : null;

    const sortinoRatio = (averageReturn - riskFreeRate) / downsideDev;
    const roundedSortinoRatio = sortinoRatio !== null ? sortinoRatio.toFixed(2) : null;

    return {
        length: length,
        pl: formattedTotalPL,
        plWCosts: formattedTotalPLWCosts,
        annualizedPl: formattedAnnualizedPL,
        numTrades: numberOfTrades,
        numProfTrades: numberOfProfitableTrades,
        percTradesProfit: ((numberOfProfitableTrades / numberOfTrades) * 100).toFixed(2) + '%',
        sharpeRatio: roundedSharpeRatio,
        sortinoRatio: roundedSortinoRatio,
        maxDrawdown: formattedMaxDrawdown,
        maxGain: formattedMaxGain,
        meanReturn: formattedAvgReturn,
        stddevReturn: formattedStdReturn,
        maxReturn: formattedMax,
        minReturn: formattedMin,
    };
}
