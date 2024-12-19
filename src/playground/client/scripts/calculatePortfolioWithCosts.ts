export default function calculatePortfolioWithCosts(
    stockData: any,
    tradingCostPercent: number
): number[] {
    const tradingCostMultiplier = 1 - tradingCostPercent / 100;
    let currentPosition = 0; // Tracks the current position (fraction of portfolio invested)

    const portfolioValues: number[] = stockData.portfolio; // Original portfolio values
    const portfolioValuesWithCosts: number[] = []; // To store portfolio values with trading costs applied

    portfolioValues.forEach((portfolioValue: number, index: number) => {
        const signal = stockData.signal[index];

        // Determine if there's a position change
        let adjustedPortfolioValue = portfolioValue;
        if (signal !== currentPosition) {
            // Position change => apply trading costs
            const tradeAmount = Math.abs(signal - currentPosition) * portfolioValue;
            const tradingCost = tradeAmount * (1 - tradingCostMultiplier);

            // Deduct trading cost from portfolio
            adjustedPortfolioValue -= tradingCost;

            // Update current position
            currentPosition = signal;
        }

        // Push the adjusted value to the array
        portfolioValuesWithCosts.push(adjustedPortfolioValue);
    });

    return portfolioValuesWithCosts;
}
