import { ChartData } from "chart.js";
import { StrategyResult } from "../../../../../../shared/sharedTypes";

export default function buildDosChart(
  stockDataReturns: number[],
): ChartData<"bar", number[], string> {
  const binCount = 10 + Math.round(stockDataReturns.length / 10); // Number of bins
  const minReturn = Math.min(...stockDataReturns);
  const maxReturn = Math.max(...stockDataReturns);
  const binWidth =
    maxReturn === minReturn ? 1 : (maxReturn - minReturn) / binCount;

  const binsNormal = Array(binCount).fill(0); // Normal data bins
  stockDataReturns.forEach((value) => {
    const binIndex = Math.min(
      Math.floor((value - minReturn) / binWidth),
      binCount - 1, // Ensure max values fall into the last bin
    );
    binsNormal[binIndex]++;
  });

  // Process log-transformed data
  const logTransformedReturns = stockDataReturns.map(
    (value) => Math.log(Math.abs(value) + 1) * Math.sign(value),
  );
  const minLog = Math.min(...logTransformedReturns);
  const maxLog = Math.max(...logTransformedReturns);
  const logBinWidth = (maxLog - minLog) / binCount;

  const binsLog = Array(binCount).fill(0); // Log data bins
  logTransformedReturns.forEach((value) => {
    const binIndex = Math.min(
      Math.floor((value - minLog) / logBinWidth),
      binCount - 1, // Ensure max values fall into the last bin
    );
    binsLog[binIndex]++;
  });

  // Generate labels for bins (use the normal data bins for labels)
  const binLabels = binsNormal.map((_, index) => {
    const start = minReturn + index * binWidth;

    const scalePrecision = (value: number) => {
      if (Math.abs(value) >= 1) return 1; // Use 1 decimal for large values
      if (Math.abs(value) >= 0.1) return 2; // Use 2 decimals for medium values
      if (Math.abs(value) >= 0.01) return 3; // Use 3 decimals for smaller values
      return 4; // Use 4 decimals for very small values
    };

    const startPrecision = scalePrecision(start * 100);
    return `${(100 * start).toFixed(startPrecision)}%`;
  });

  // Chart data with two datasets
  const chartData: ChartData<"bar", number[], string> = {
    labels: binLabels,
    datasets: [
      {
        label: "returns",
        data: binsNormal,
        backgroundColor: "rgba(20, 40, 80, 0.3)",
        borderColor: "rgba(20, 40, 80, 1)",
        borderWidth: 1,
        barPercentage: 0.9,
        categoryPercentage: 1,
        barThickness: "flex",
      },
      {
        label: "log(returns)",
        data: binsLog,
        backgroundColor: "rgba(100, 150, 200, 0.3)",
        borderColor: "rgba(100, 150, 200, 1)",
        borderWidth: 1,
        barPercentage: 0.9,
        categoryPercentage: 1,
        barThickness: "flex",
      },
    ],
  };

  return chartData;
}
