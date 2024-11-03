// interface StockDataResponse {
//     // Define the structure based on the Yahoo Finance API response
//     indicators: any
//     meta: any[]
//     timestamp: any;
// }

export default async function getStockData(
    stockSymbol: string,
    startDate: string,
    endDate: string,
    intval: string
): Promise<any> {
    const url = `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?period1=${new Date(startDate).getTime() / 1000}&period2=${new Date(endDate).getTime() / 1000}&interval=${intval}`;

    const response = await fetch(url);
    const stockData = await response.json();

    return stockData;
}
