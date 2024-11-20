import { HttpError } from "wasp/server";

function validateStockData({ stockData }: { stockData: any }) {
  if (!stockData) {
    throw new HttpError(500, "Stock data is undefined. Please try again later.");
  }

  // Check for error message in response
  const errMsg = stockData.chart?.error;
  if (errMsg) {
    throw new HttpError(500, "Stock data retrieval failed: " + errMsg);
  }

  // Check that 'chart.result' is an array with exactly one item
  if (!Array.isArray(stockData.chart?.result) || stockData.chart.result.length !== 1) {
    throw new HttpError(500, "Unexpected number of results returned for the provided symbol. Please try again.");
  }

  const result = stockData.chart.result[0];

  // Validate structure of 'indicators.quote' and check for required arrays
  if (!result.indicators?.quote || !Array.isArray(result.indicators.quote) || result.indicators.quote.length === 0) {
    throw new HttpError(500, "Stock data structure is invalid or missing indicators.");
  }

  const quote = result.indicators.quote[0];
  const closePrices = quote?.close;

  // Check 'close' data array
  if (!Array.isArray(closePrices) || closePrices.length < 5) {
    throw new HttpError(400, "Less than 5 data points were returned for the stock in the selected time period. Please expand the time window.");
  }

  // Validate that all close prices are numbers and not null/undefined
  if (!closePrices.every((price: any) => typeof price === "number" && !isNaN(price))) {
    throw new HttpError(400, "Invalid data detected in close prices. Ensure all data points are valid numbers.");
  }

  // (Optional) Check if the data timestamps match the requested range
  const timestamps = result.timestamp;
  if (!Array.isArray(timestamps) || timestamps.length !== closePrices.length) {
    throw new HttpError(500, "Mismatch between timestamps and close prices in the data.");
  }

  // Append the timestamp
  quote.timestamp = timestamps;

  return quote;
}

export default validateStockData;
