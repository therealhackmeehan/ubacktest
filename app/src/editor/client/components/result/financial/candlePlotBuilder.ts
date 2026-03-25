import { ChartData } from "chart.js";
import { StrategyResultProps } from "../../../../../shared/sharedTypes";

export type MixedChartType = "line" | "candlestick";

export type LinePoint = {
  x: Date;
  y: number;
};

export type CandlePoint = {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
};

export type MixedDataPoint = LinePoint | CandlePoint | null;

export function buildCandlePlot(
  strategyResult: StrategyResultProps,
  symbol: string,
  costPerTrade: number,
  hideTradingCosts: boolean,
): ChartData<MixedChartType> {
  const datasets = [
    {
      type: "line" as const,
      label: "My Strategy",
      data: strategyResult.timestamp.map((timestamp, index) => ({
        x: new Date(timestamp),
        y: strategyResult.portfolio[index],
      })),
      borderColor: "rgba(0, 0, 0, .8)",
      backgroundColor: "rgba(0, 0, 0, .8)",
      pointRadius: 0,
      borderWidth: 2,
      yAxisID: "y1",
      tension: 0.05,
    },
    {
      type: "candlestick" as const,
      label: symbol.toUpperCase(),
      data: strategyResult.timestamp.map((timestamp, index) => ({
        x: new Date(timestamp).getTime(),
        o: strategyResult.open[index],
        h: strategyResult.high[index],
        l: strategyResult.low[index],
        c: strategyResult.close[index],
      })),
      yAxisID: "y1",
    },
    {
      type: "line" as const,
      label: "Buy/Sell Signal",
      data: strategyResult.timestamp.map((timestamp, index) => ({
        x: new Date(timestamp),
        y: strategyResult.signal[index],
      })),
      borderColor: "rgba(0, 155, 255, .6)",
      backgroundColor: "rgba(0, 155, 255, .6)",
      stepped: true,
      pointRadius: 0,
      borderWidth: 1,
      yAxisID: "y2",
    },
    {
      type: "line" as const,
      label: "My Strategy (w/ trading costs)",
      data: strategyResult.timestamp.map((timestamp, index) => ({
        x: new Date(timestamp),
        y: strategyResult.portfolioWithCosts[index],
      })),
      borderColor: "rgba(255, 0, 100, 0.6)",
      backgroundColor: "rgba(255, 0, 100, 0.6)",
      borderWidth: 1,
      pointRadius: 0,
      yAxisID: "y1",
    },
  ];

  if (costPerTrade === 0 || hideTradingCosts) {
    datasets.pop();
  }

  return { datasets: datasets } as ChartData<MixedChartType>;
}
