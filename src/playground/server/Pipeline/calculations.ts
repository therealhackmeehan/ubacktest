// Helper function to calculate portfolio values
const calculatePortfolio = (data: any): number[] => {
    const dailyValues: number[] = [];
    let portfolioValue = data.close[0]; // Initial portfolio value

    for (let i = 0; i < data.close.length - 1; i++) {
        const dailyChange = (data.close[i + 1] - data.close[i]) / data.close[i];
        const position = data.signal[i]; // -1: short, 0: hold, 1: buy
        portfolioValue += portfolioValue * dailyChange * position;
        dailyValues.push(portfolioValue);
    }

    return dailyValues;
};

export default calculatePortfolio;