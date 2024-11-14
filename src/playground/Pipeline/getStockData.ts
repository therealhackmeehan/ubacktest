interface stockDataProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
}

async function getStockData({ symbol, startDate, endDate, intval }: stockDataProps) {
    const url = `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${new Date(startDate).getTime() / 1000}&period2=${new Date(endDate).getTime() / 1000}&interval=${intval}`;

    const response = await fetch(url);    

    if (!response.ok) {
        throw new Error(`Unable to Connect to the Internet to Retreive Stock Data: ${response.statusText}`);
    }

    const stockData = await response.json();
    return stockData;

}

export default getStockData;