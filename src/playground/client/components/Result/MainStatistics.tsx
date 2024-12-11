export default function MainStatistics({ stockData }: { stockData: any }) {

    const exampleStat = '12.3%';
    const length = stockData.portfolio.length - 1;

    // Calculate total profit/loss
    const totalPL = (stockData.portfolio[length] - stockData.portfolio[0]) / stockData.portfolio[0];
    const formattedTotalPL = totalPL !== null ? (100 * totalPL).toFixed(2) + '%' : null;

    // Convert Unix timestamps to JavaScript Date objects
    const firstDate = new Date(stockData.timestamp[0] * 1000).getTime();
    const lastDate = new Date(stockData.timestamp[length] * 1000).getTime();

    const numberOfDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const annualizedPL = ((1 + totalPL) ** (365 / numberOfDays)) - 1;
    const formattedAnnualizedPL = annualizedPL !== null ? (annualizedPL * 100).toFixed(2) + '%' : null;

    let numberOfTrades = 1;
    let numberOfProfitableTrades = 0;  // Variable to track profitable trades
    let peak = stockData.portfolio[0]; // Initialize peak with the first portfolio value
    let maxDrawdown = 0; // Variable to store the maximum drawdown

    let buyPrice = null;  // To store the buy price when a "buy" signal is encountered

    for (let i = 1; i < length; i++) {
        // Check if there's a change in the signal (trade change)
        if (stockData.signal[i] !== stockData.signal[i - 1]) {
            numberOfTrades++;

            // If it's a "buy" signal, record the buy price
            if (stockData.signal[i] === 1 && buyPrice === null) {
                buyPrice = stockData.portfolio[i];
            }

            // If it's a "sell" signal, calculate the profitability of the trade
            if (stockData.signal[i] === 0 && buyPrice !== null) {
                const profitLoss = (stockData.portfolio[i] - buyPrice) / buyPrice;
                if (profitLoss > 0) {
                    numberOfProfitableTrades++;  // Increment if the trade is profitable
                }
                buyPrice = null;  // Reset buy price after a sell signal
            }
        }

        // Track the peak value (if the current value is higher than the previous peak)
        if (stockData.portfolio[i] > peak) {
            peak = stockData.portfolio[i];
        }

        // Calculate the drawdown at this point and update max drawdown
        const drawdown = (peak - stockData.portfolio[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    // Convert max drawdown to percentage and round it
    const formattedMaxDrawdown = maxDrawdown !== null ? (maxDrawdown * 100).toFixed(2) + '%' : null;

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
    const roundedSharpeRatio = sharpeRatio !== null ? sharpeRatio.toFixed(2) : null;

    // Sortino Ratio calculation
    const sortinoRatio = (averageReturn - riskFreeRate) / downsideDev;
    const roundedSortinoRatio = sortinoRatio !== null ? sortinoRatio.toFixed(2) : null;

    return (
        <div className="p-4 border-r-2 border-black col-span-1 bg-slate-100">
            <div className='font-extrabold mb-2 text-xl text-start tracking-tight p-2 rounded-lg border-black border-2 bg-white'>
                Stats
            </div>
            <Stat text={'profit/loss'} stat={formattedTotalPL} />
            <Stat text={'approx. annualized profit/loss'} stat={formattedAnnualizedPL} />
            <Stat text={'number of trades'} stat={numberOfTrades} />
            <Stat text={'number of profitable trades'} stat={numberOfProfitableTrades} />
            <Stat text={'% trades profitable'} stat={(numberOfProfitableTrades/numberOfTrades).toFixed() + '%'} />
            <Stat text={'sharpe ratio'} stat={roundedSharpeRatio} />
            <Stat text={'sortino ratio'} stat={roundedSortinoRatio} />
            <Stat text={'max drawdown'} stat={formattedMaxDrawdown} />
        </div>
    )
}

interface StatProps {
    text: string;
    stat: number | string | null;
}
function Stat({ text, stat }: StatProps) {

    return (
        <div className="p-1 flex justify-between">
            <div className="text-xs">
                {text}
            </div>

            <div className="font-bold tracking-tight text-sm">
                {stat !== null ? stat : "na"}
            </div>
        </div>
    )
}
