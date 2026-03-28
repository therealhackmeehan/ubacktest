import { useState, useEffect } from "react";
import { StrategyResult } from "../../../../../../shared/sharedTypes";
import ChartWrapper from "../../../../../../client/components/ChartWrapper";

import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
  ScriptableScaleContext,
  ChartData,
} from "chart.js";
import buildSpChart from "./build";
import { LinePoint } from "../plot-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
);

interface SPChartProps {
  strategyResult: StrategyResult;
}

function SPChart({ strategyResult }: SPChartProps) {
  const [chartData, setChartData] = useState<ChartData<
    "line",
    LinePoint[]
  > | null>(null);

  useEffect(() => {
    let chartData = buildSpChart(strategyResult);
    setChartData(chartData);
  }, [strategyResult]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (tickValue: string | number) => {
            const value =
              typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return "$" + value.toFixed(2);
          },
        },
        grid: {
          color: (tick: ScriptableScaleContext) =>
            tick.tick.value == 1
              ? "rgba(100,100,100,.5)"
              : "rgba(100,100,100,0)",
          lineWidth: 2,
        },
      },
      x: {
        type: "timeseries" as const,
        grid: {
          display: false,
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="w-full mt-4 text-center text-xl tracking-tight">
        Loading...
      </div>
    );
  }

  return (
    <div className="m-2">
      <div className="text-lg tracking-tight font-bold text-sky-700">
        Did you beat the S&P 500?
        <span className="mx-1 text-xs italic">(SPY)</span>
      </div>
      <ChartWrapper height={65}>
        <Line data={chartData} options={options} />
      </ChartWrapper>
    </div>
  );
}

export default SPChart;
