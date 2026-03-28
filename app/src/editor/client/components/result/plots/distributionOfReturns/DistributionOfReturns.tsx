import { useEffect, useState } from "react";
import ChartWrapper from "../../../../../../client/components/ChartWrapper";
import buildDosChart from "./build";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface DistributionOfReturnsProps {
  stockDataReturns: number[];
  mean: number | null;
  stddev: number | null;
  max: number | null;
  min: number | null;
}

export default function DistributionOfReturns({
  stockDataReturns,
  mean,
  stddev,
  max,
  min,
}: DistributionOfReturnsProps) {
  const [returnsChartData, setReturnsChartData] = useState<
    ChartData<"bar", number[], string>
  >({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Process normal data
    const chartData = buildDosChart(stockDataReturns);
    setReturnsChartData(chartData);
  }, [stockDataReturns]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Show legend to differentiate datasets
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <>
      <div className="m-2 flex justify-between items-center">
        <div className="text-lg tracking-tight font-bold">
          Distribution of Returns
        </div>
        <div className="flex justify-items-center gap-x-2">
          {max && (
            <div className="text-xs p-1 bg-white rounded-md font-light hover:border-2 border-slate-200 duration-100">
              max = {max.toFixed(2)}%
            </div>
          )}
          {min && (
            <div className="text-xs p-1 bg-white rounded-md font-light hover:border-2 border-slate-200 duration-100">
              min = {min.toFixed(2)}%
            </div>
          )}
          {mean && (
            <div className="text-xs p-1 bg-white rounded-md font-light hover:border-2 border-slate-200 duration-100">
              &mu; = {mean.toFixed(2)}%
            </div>
          )}
          {stddev && (
            <div className="text-xs p-1 bg-white rounded-md font-light hover:border-2 border-slate-200 duration-100">
              &sigma; = {stddev.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
      <ChartWrapper height={20}>
        <Bar data={returnsChartData} options={options} />{" "}
      </ChartWrapper>
    </>
  );
}
