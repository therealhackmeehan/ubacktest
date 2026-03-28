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
  ChartData,
} from "chart.js";
import buildUserDefined from "./build";
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

interface UserDefinedPlotProps {
  strategyResult: StrategyResult;
  timestamp: StrategyResult["timestamp"];
}

export default function UserDefinedPlot({
  strategyResult,
  timestamp,
}: UserDefinedPlotProps) {
  const [chartData, setChartData] = useState<ChartData<
    "line",
    LinePoint[]
  > | null>(null);
  useEffect(() => {
    if (
      !strategyResult.userDefinedData ||
      !strategyResult.signal ||
      !strategyResult.close ||
      !timestamp
    )
      return;

    const datasets = buildUserDefined(strategyResult, timestamp);
    setChartData(datasets);
  }, [strategyResult, timestamp]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
    },
    layout: {
      padding: 20,
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        type: "timeseries" as const,
      },
      y1: {
        position: "left" as const,
      },
      y2: {
        position: "right" as const,
        label: "Position",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (val: string | number) {
            if (val === -1) {
              return "Short" as const;
            } else if (val === 0) {
              return "No Position" as const;
            } else if (val === 1) {
              return "Buy" as const;
            }
            return "" as const;
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

  if (!chartData)
    return (
      <div className="w-full h-[60vh] mt-4 text-center text-xl tracking-tight animate-pulse">
        Loading...
      </div>
    );
  return (
    <ChartWrapper height={60}>
      <Line data={chartData} options={options} />
    </ChartWrapper>
  );
}
