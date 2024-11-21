import { HttpError } from "wasp/server";
interface stockDataProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
}

async function getStockData({ symbol, startDate, endDate, intval }: stockDataProps) {

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${new Date(startDate).getTime() / 1000}&period2=${new Date(endDate).getTime() / 1000}&interval=${intval}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new HttpError(
            503, // Service Unavailable
            `Unable to connect to retrieve stock data: ${response.statusText}`
        );
    }

    const stockData = await response.json();
    return stockData;

}

export default getStockData;