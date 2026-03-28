import { ChartData } from "chart.js";

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

export type LineChartState = ChartData<"line", LinePoint[]> | null;
export type BarChartState = ChartData<"bar", number[], string>;
export type FinancialChartState = ChartData<"line" | "candlestick"> | null;
