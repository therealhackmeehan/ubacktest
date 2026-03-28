import { ChartData } from "chart.js";
import { StrategyResult } from "../../../../../../shared/sharedTypes";
import { LinePoint } from "../plot-types";

const borderColors: string[] = [
  "rgba(44, 62, 80, 1)", // Dark Blue-Gray
  "rgba(39, 174, 96, 1)", // Emerald Green
  "rgba(41, 128, 185, 1)", // Deep Sky Blue
  "rgba(142, 68, 173, 1)", // Dark Purple
  "rgba(231, 76, 60, 1)", // Cool Red
];

export default function buildUserDefined(
  strategyResult: StrategyResult,
  timestamp: StrategyResult["timestamp"],
): ChartData<"line", LinePoint[]> {
  const datasets = Object.entries(strategyResult.userDefinedData).map(
    ([key, values], index) => {
      return {
        label: key,
        data: values.map((value: number, index: number) => ({
          x: new Date(timestamp[index]),
          y: value,
        })),
        borderColor: borderColors[index % borderColors.length],
        stepped: false,
        hidden: false,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: "y1",
      };
    },
  );

  datasets.push({
    label: "Buy/Sell Signal",
    data: strategyResult.signal.map((value: number, index: number) => ({
      x: new Date(timestamp[index]),
      y: value,
    })),
    borderColor: "rgba(0, 155, 255, .6)",
    stepped: true,
    hidden: true,
    pointRadius: 0,
    borderWidth: 2,
    yAxisID: "y2",
  });

  datasets.push({
    label: "Close Price",
    data: strategyResult.close.map((value: number, index: number) => ({
      x: new Date(timestamp[index]),
      y: value,
    })),
    borderColor: "rgba(123, 50, 168, 1)",
    stepped: false,
    hidden: true,
    pointRadius: 0,
    borderWidth: 2,
    yAxisID: "y1",
  });

  return { datasets: datasets };
}
