import { useState, useEffect, useRef } from "react";
import ChartWrapper from "../../../../../../client/components/ChartWrapper";
import { StrategyResult } from "../../../../../../shared/sharedTypes";
import { buildCandlePlot } from "./build";
import { MixedDataPoint } from "../plot-types";

import { Chart } from "react-chartjs-2";
import { TooltipItem, ScriptableScaleContext, ChartData } from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJSInstance,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
} from "chart.js";

import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";

ChartJSInstance.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
  CandlestickController,
  CandlestickElement,
  zoomPlugin,
);

interface LinePlotProps {
  strategyResult: StrategyResult;
  costPerTrade: number;
  symbol: string;
  hideTradingCosts?: boolean;
}

function CandlePlot({
  strategyResult,
  costPerTrade,
  symbol,
  hideTradingCosts = false,
}: LinePlotProps) {
  const [chartData, setChartData] = useState<ChartData<
    "line" | "candlestick"
  > | null>(null);

  const chartRef = useRef<ChartJSInstance<"line" | "candlestick"> | null>(null);

  const resetZ = () => {
    chartRef.current?.resetZoom();
  };

  useEffect(() => {
    const data = buildCandlePlot(
      strategyResult,
      symbol,
      costPerTrade,
      hideTradingCosts,
    );

    setChartData(data);
  }, [strategyResult, costPerTrade, symbol, hideTradingCosts]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    animation: strategyResult.timestamp.length > 365 ? false : {},
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line" | "candlestick">) {
            const label = context.dataset.label || "";
            const value = context.raw as MixedDataPoint;

            if (!value) return label;

            if ("o" in value) {
              return `${label} | Open: $${value.o} High: $${value.h} Low: $${value.l} Close: $${value.c}`;
            }

            return `${label}: ${value.y.toFixed(3)}`;
          },
        },
      },
      legend: {
        position: "top" as const,
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x" as const,
        },
      },
    },
    scales: {
      x: {
        type: "timeseries" as const,
      },
      y1: {
        ticks: {
          callback: (tickValue: string | number) => {
            const value =
              typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return "$" + value.toFixed(2);
          },
        },
        grid: {
          color: (ctx: ScriptableScaleContext) => {
            const val = ctx.tick?.value;
            return val === 1 ? "rgba(100,100,100,.4)" : "rgba(100,100,100,.1)";
          },
          lineWidth: 1,
        },
      },
      y2: {
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (val: string | number) => {
            if (val === -1) return "Short";
            if (val === 0) return "No Position";
            if (val === 1) return "Buy";
            return "";
          },
          font: {
            weight: "bolder" as const,
          },
          color: "rgba(0, 155, 255, .6)",
        },
        suggestedMin: -1.1,
        suggestedMax: 1.1,
      },
    },
  };

  if (!chartData) {
    return (
      <div className="w-full mt-4 h-[65vh] text-center text-xl tracking-tight animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <ChartWrapper height={65}>
      <Chart
        ref={chartRef}
        type="candlestick"
        data={chartData}
        options={options}
        onClick={resetZ}
      />
    </ChartWrapper>
  );
}

export default CandlePlot;
