import { HttpError } from "wasp/server";

function validateStockData({ stockData }: { stockData: any }) {
  const errMsg = stockData.chart?.error;
  if (errMsg) throw new HttpError(500, `Stock data retrieval failed or was not found: \n\n\nError Message: '${errMsg}'`);

  const result = stockData.chart.result?.[0];
  const quote = result?.indicators?.quote?.[0];

  const closePrices = quote?.close;
  const timestamps = result?.timestamp;

  if (!closePrices) throw new HttpError(400, "Although it appears this stock exists, no data was found. Try another stock or adjust the timeframe.");
  if (!Array.isArray(closePrices)) throw new HttpError(500, "The return type of this data query was not an array. Please try again.");
  if (closePrices.length < 5) throw new HttpError(400, "Less than 5 data points available for a backtest.");
  if (!closePrices.every((price) => typeof price === "number" && !isNaN(price))) throw new HttpError(400, "Invalid data detected in close prices.");
  // Think of more edge cases!

  if (!Array.isArray(timestamps) || timestamps.length !== closePrices.length) throw new HttpError(500, "Mismatch between timestamps and close prices.");
  quote.timestamp = timestamps;

  return quote;
}

export default validateStockData;
