import { ChartData } from "chart.js";
import { StrategyResult } from "../../../../../../shared/sharedTypes";
import { LinePoint } from "../plot-types";

export default function buildCashEquity(
  strategyResult: StrategyResult,
): ChartData<"line", LinePoint[]> {
  const datasets = [
    {
      label: "Cash Value",
      data: strategyResult.timestamp.map(
        (timestamp: string, index: number) => ({
          x: new Date(timestamp),
          y: strategyResult.cash[index],
        }),
      ),
      borderColor: "rgba(255, 69, 0, 1)", // Bold Red-Orange
      backgroundColor: "rgba(255, 69, 0, 1)",
      pointRadius: 0,
      borderWidth: 1,
      stepped: true,
    },
    {
      label: "Equity Value",
      data: strategyResult.timestamp.map(
        (timestamp: string, index: number) => ({
          x: new Date(timestamp),
          y: strategyResult.equity[index],
        }),
      ),
      borderColor: "rgba(34, 139, 34, 1)", // Deep Forest Green
      backgroundColor: "rgba(34, 139, 34, 1)",
      pointRadius: 0,
      borderWidth: 1,
      stepped: true,
    },
    {
      label: "abs(Equity Value)",
      data: strategyResult.timestamp.map(
        (timestamp: string, index: number) => ({
          x: new Date(timestamp),
          y: Math.abs(strategyResult.equity[index]),
        }),
      ),
      borderColor: "rgba(0, 128, 255, 1)", // Vivid Blue
      backgroundColor: "rgba(0, 128, 255, 1)",
      pointRadius: 0,
      borderWidth: 1,
      stepped: true,
    },
  ];

  return { datasets: datasets };
}
