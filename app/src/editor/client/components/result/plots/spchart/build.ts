import { ChartData } from "chart.js";
import { StrategyResult } from "../../../../../../shared/sharedTypes";
import { LinePoint } from "../plot-types";

export default function buildSpChart(
  strategyResult: StrategyResult,
): ChartData<"line", LinePoint[]> {
  const datasets = [
    {
      label: "My Strategy",
      data: strategyResult.timestamp.map(
        (timestamp: string, index: number) => ({
          x: new Date(timestamp),
          y: strategyResult.portfolio[index],
        }),
      ),
      borderColor: "rgba(255, 0, 100, 1)",
      backgroundColor: "rgba(255, 0, 100, 1)",
      pointRadius: 0,
      borderWidth: 1,
    },
    {
      label: "S&P 500 Index",
      data: strategyResult.timestamp.map(
        (timestamp: string, index: number) => ({
          x: new Date(timestamp),
          y: strategyResult.sp[index],
        }),
      ),
      borderColor: "rgba(123, 50, 168, 1)",
      pointRadius: 0,
      borderWidth: 1,
    },
  ];

  return { datasets: datasets };
}
