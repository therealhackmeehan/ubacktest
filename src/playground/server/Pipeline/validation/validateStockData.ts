import { HttpError } from "wasp/server";

interface validateAndNormalizeStockDataProps {
  stockData: any;
  timeOfDay: string;
}

function validateAndNormalizeStockData({ stockData, timeOfDay }: validateAndNormalizeStockDataProps) {
  const errMsg = stockData.chart?.error;
  if (errMsg) throw new HttpError(500, `Stock data retrieval failed or was not found: \n\n\nError Message: '${errMsg}'`);

  const result = stockData.chart.result?.[0];
  const quote = result?.indicators?.quote?.[0];

  const closePrices = quote?.close;
  const highPrices = quote?.high;
  const lowPrices = quote?.low;
  const openPrices = quote?.open;
  const timestamps = result?.timestamp;

  // Validation checks
  if (!closePrices) throw new HttpError(400, "Although it appears this stock exists, no data was found. Try another stock or adjust the timeframe.");
  if (!Array.isArray(closePrices) || closePrices.length < 5) 
    throw new HttpError(400, "Less than 5 data points available for a backtest.");
  if (!closePrices.every((price) => typeof price === "number" && !isNaN(price))) 
    throw new HttpError(400, "Invalid data detected in close prices.");
  if (!Array.isArray(timestamps) || timestamps.length !== closePrices.length) 
    throw new HttpError(500, "Mismatch between timestamps and close prices.");
  
  if (!Array.isArray(highPrices) || !Array.isArray(lowPrices) || !Array.isArray(openPrices)) 
    throw new HttpError(500, "Invalid structure for high, low, or open data. Expected arrays.");
  if (highPrices.length !== closePrices.length || lowPrices.length !== closePrices.length || openPrices.length !== closePrices.length) 
    throw new HttpError(500, "Mismatch in data length for high, low, open, and close arrays.");

  // Normalize data by dividing by the first price
  const firstPrice = quote?.[timeOfDay][0];
  if (!firstPrice || typeof firstPrice !== "number" || isNaN(firstPrice)) 
    throw new HttpError(500, "First close price is invalid. Cannot normalize data.");

  const normalizedQuote = {
    high: highPrices.map((price) => price / firstPrice),
    low: lowPrices.map((price) => price / firstPrice),
    open: openPrices.map((price) => price / firstPrice),
    close: closePrices.map((price) => price / firstPrice),
    timestamp: timestamps,
  };

  return normalizedQuote;
}

export default validateAndNormalizeStockData;
