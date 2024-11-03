import StockChart from "./Charts"

interface ResultsStruct {
    stockData: any;
    pythonResponse: any;
}


export const Results: React.FC<ResultsStruct> = ({ stockData, pythonResponse }) => {

    const parsedSignal = JSON.parse(pythonResponse.run.output);
    const closes = stockData[0].indicators.quote[0].close;

    // build the portfolio value array
    let portfolioValue = closes[0]; // Starting portfolio value (could be any number)
    const dailyValues = [portfolioValue]; // Store cumulative portfolio values over time

    for (let i = 0; i < closes.length - 1; i++) {
        const dailyChange = (closes[i + 1] - closes[i]) / closes[i]; // Next day's percentage change
        const position = parsedSignal[i]; // -1: short, 0: hold, 1: buy on current day's signal

        portfolioValue += portfolioValue * dailyChange * position; // Apply position to next day's change
        dailyValues.push(portfolioValue); // Store updated portfolio value
    }

    stockData[0].indicators.quote[0].portfolio = dailyValues;
    // plot portfolio value alongside closes and opens!

    return (
        <>
            <StockChart stockData={stockData} />
        </>
    )
}