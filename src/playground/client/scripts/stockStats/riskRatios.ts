export default function riskRatios({ stockData }: { stockData: any }) {
    // Ensure stockData has the necessary properties
    if (!stockData.returns || stockData.returns.length < 2) {
        throw new Error();
    }

    const returns = stockData.returns;

    // Average return (mean)
    const averageReturn = returns.reduce((sum: number, ret: number) => sum + ret, 0) / returns.length;

    // Standard deviation of all returns (for Sharpe Ratio)
    const variance =
        returns.reduce((sum: number, ret: number) => sum + Math.pow(ret - averageReturn, 2), 0) /
        (returns.length - 1);
    const stdDev = Math.sqrt(variance);

    // Downside deviation (for Sortino Ratio)
    const negativeReturns = returns.filter((ret: number) => ret < 0);
    const downsideVariance =
        negativeReturns.reduce((sum: number, ret: number) => sum + Math.pow(ret, 2), 0) /
        (negativeReturns.length || 1); // Prevent divide by zero
    const downsideDev = Math.sqrt(downsideVariance);

    // Assume risk-free rate is 0 for simplicity
    const riskFreeRate = 0;

    // Sharpe Ratio calculation
    const sharpeRatio = (averageReturn - riskFreeRate) / stdDev;

    // Sortino Ratio calculation
    const sortinoRatio = (averageReturn - riskFreeRate) / downsideDev;

    return {
        sharpeRatio,
        sortinoRatio,
    };
}
