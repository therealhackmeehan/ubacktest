
function validateStockData({ stockData }: { stockData: any }) {
  if (!stockData) {
    throw new Error("Stock Data has returned as undefined. Please try again.");
  }

  // Check for error message in response
  const errMsg = stockData.chart?.error;
  if (errMsg) {
    throw new Error("Stock Data retrieval failed: " + errMsg);
  }

  // Check that 'chart.result' is an array with exactly one item
  if (!Array.isArray(stockData.chart?.result) || stockData.chart.result.length !== 1) {
    throw new Error("Unexpected number of results returned for that symbol. Please try again.");
  }

  const result = stockData.chart.result[0];

  // Validate structure of 'indicators.quote' and check for required arrays
  if (!result.indicators?.quote || !Array.isArray(result.indicators.quote) || result.indicators.quote.length === 0) {
    throw new Error("Stock data structure is invalid or missing indicators.");
  }

  const quote = result.indicators.quote[0];
  const closePrices = quote?.close;

  // Check 'close' data array
  if (!Array.isArray(closePrices) || closePrices.length < 5) {
    throw new Error("Less than 5 data points were returned for that stock in that time period. Please widen your window.");
  }

  // Validate that all close prices are numbers and not null/undefined
  if (!closePrices.every((price: any) => typeof price === "number" && !isNaN(price))) {
    throw new Error("Invalid data detected in close prices. Ensure data points are numbers.");
  }

  // (Optional) Check if the data timestamps match the requested range
  const timestamps = result.timestamp;
  if (!Array.isArray(timestamps) || timestamps.length !== closePrices.length) {
    throw new Error("Mismatch between timestamps and close prices.");
  }

  return quote;
}

export default validateStockData;
