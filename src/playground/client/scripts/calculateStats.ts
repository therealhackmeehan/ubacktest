

export interface StatProps {
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
}

// export interface stockDataProps {
//     close: number[],
//     high: number[],
//     low: number[],
//     open: number[],
//     portfolio: number[],
//     returns: number[],
//     signal: number[],
//     timestamp: number[],
// }

export default function calculateStats({ stockData }: { stockData: any }): StatProps {
    const length = stockData.portfolio.length - 1;

    // Calculate total profit/loss
    const totalPL = (stockData.portfolio[length] - stockData.portfolio[0]) / stockData.portfolio[0];
    const formattedTotalPL = totalPL !== null ? (100 * totalPL).toFixed(2) + '%' : null;

    const totalPLWCosts = (stockData.portfolioWithCosts[length] - stockData.portfolioWithCosts[0]) / stockData.portfolio[0];
    const formattedTotalPLWCosts = totalPLWCosts !== null ? (100 * totalPLWCosts).toFixed(2) + '%' : null;

    // Convert Unix timestamps to JavaScript Date objects
    const firstDate = new Date(stockData.timestamp[0] * 1000).getTime();
    const lastDate = new Date(stockData.timestamp[length] * 1000).getTime();

    const numberOfDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const annualizedPL = ((1 + totalPL) ** (365 / numberOfDays)) - 1;
    const formattedAnnualizedPL = annualizedPL !== null ? (annualizedPL * 100).toFixed(2) + '%' : null;

    let numberOfTrades = 1;
    let numberOfProfitableTrades = 0;
    let peak = stockData.portfolio[0];
    let maxDrawdown = 0;

    let buyPrice = stockData.portfolio[0];

    for (let i = 1; i < length; i++) {
        if (stockData.signal[i] !== stockData.signal[i - 1]) {
            numberOfTrades++;

            if (stockData.portfolio[i] > buyPrice) {
                numberOfProfitableTrades++;
            }

            buyPrice = stockData.portfolio[i];
        }

        if (stockData.portfolio[i] > peak) {
            peak = stockData.portfolio[i];
        }

        const drawdown = (peak - stockData.portfolio[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    const formattedMaxDrawdown = maxDrawdown !== null ? (maxDrawdown * 100).toFixed(2) + '%' : null;

    const maxGain = Math.max.apply(Math, stockData.portfolio) - 1;
    const formattedMaxGain = maxGain !== null ? (maxGain * 100).toFixed(2) + '%' : null;

    const returns = stockData.returns;

    const averageReturn = returns.reduce((sum: number, ret: number) => sum + ret, 0) / returns.length;

    const variance =
        returns.reduce((sum: number, ret: number) => sum + Math.pow(ret - averageReturn, 2), 0) /
        (returns.length - 1);
    const stdDev = Math.sqrt(variance);

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
    };
}
