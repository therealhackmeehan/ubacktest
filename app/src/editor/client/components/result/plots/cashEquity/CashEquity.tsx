import { useState, useEffect } from "react";
import { StrategyResult } from "../../../../../../shared/sharedTypes";
import ChartWrapper from "../../../../../../client/components/ChartWrapper";
import buildCashEquity from "./build";

import { Line } from "react-chartjs-2";
import { ChartData, ScriptableScaleContext } from "chart.js";
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
} from "chart.js";
import { LineChartState, LinePoint } from "../plot-types";

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

interface CashEquityProps {
  strategyResult: StrategyResult;
}

function CashEquity({ strategyResult }: CashEquityProps) {
  const [chartData, setChartData] = useState<LineChartState>(null);

  useEffect(() => {
    let chartData = buildCashEquity(strategyResult);
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
            tick.tick.value == 0
              ? "rgba(100,100,100,.5)"
              : "rgba(100,100,100,.1)",
          lineWidth: 2,
        },
      },
      x: {
        type: "timeseries" as const,
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
        Cash/Equity Breakdown
        <span className="text-xs font-mono m-2 text-black/50">
          (equity may be negative if you’ve shorted the stock)
        </span>
      </div>
      <ChartWrapper height={40}>
        <Line data={chartData} options={options} />
      </ChartWrapper>
    </div>
  );
}

export default CashEquity;
