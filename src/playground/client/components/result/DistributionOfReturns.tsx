import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartWrapper from "../../../../client/components/ChartWrapper";

// Register chart components
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
  const [returnsChartData, setReturnsChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Process normal data
    const binCount = 10 + Math.round(stockDataReturns.length / 10); // Number of bins
    const minReturn = Math.min(...stockDataReturns);
    const maxReturn = Math.max(...stockDataReturns);
    const binWidth = (maxReturn - minReturn) / binCount;

    const binsNormal = Array(binCount).fill(0); // Normal data bins
    stockDataReturns.forEach((value) => {
      const binIndex = Math.min(
        Math.floor((value - minReturn) / binWidth),
        binCount - 1, // Ensure max values fall into the last bin
      );
      binsNormal[binIndex]++;
    });

    // Process log-transformed data
    const logTransformedReturns = stockDataReturns.map(
      (value) => Math.log(Math.abs(value) + 1) * Math.sign(value),
    );
    const minLog = Math.min(...logTransformedReturns);
    const maxLog = Math.max(...logTransformedReturns);
    const logBinWidth = (maxLog - minLog) / binCount;

    const binsLog = Array(binCount).fill(0); // Log data bins
    logTransformedReturns.forEach((value) => {
      const binIndex = Math.min(
        Math.floor((value - minLog) / logBinWidth),
        binCount - 1, // Ensure max values fall into the last bin
      );
      binsLog[binIndex]++;
    });

    // Generate labels for bins (use the normal data bins for labels)
    const binLabels = binsNormal.map((_, index) => {
      const start = minReturn + index * binWidth;

      const scalePrecision = (value: number) => {
        if (Math.abs(value) >= 1) return 1; // Use 1 decimal for large values
        if (Math.abs(value) >= 0.1) return 2; // Use 2 decimals for medium values
        if (Math.abs(value) >= 0.01) return 3; // Use 3 decimals for smaller values
        return 4; // Use 4 decimals for very small values
      };

      const startPrecision = scalePrecision(start * 100);
      return `${(100 * start).toFixed(startPrecision)}%`;
    });

    // Chart data with two datasets
    const chartData = {
      labels: binLabels,
      datasets: [
        {
          label: "returns",
          data: binsNormal,
          backgroundColor: "rgba(20, 40, 80, 0.3)",
          borderColor: "rgba(20, 40, 80, 1)",
          borderWidth: 1,
          lineTension: 0,
          borderJoinStyle: "round",
          barPercentage: 0.9,
          categoryPercentage: 1,
          barThickness: "flex",
        },
        {
          label: "log(returns)",
          data: binsLog,
          backgroundColor: "rgba(100, 150, 200, 0.3)",
          borderColor: "rgba(100, 150, 200, 1)",
          borderWidth: 1,
          lineTension: 0,
          borderJoinStyle: "round",
          barPercentage: 0.9,
          categoryPercentage: 1,
          barThickness: "flex",
        },
      ],
    };

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
        // offset: false,
        // gridLines: {
        //     offsetGridLines: false
        // },
        // ticks: {
        //     align: "start" as const,
        //     font: {
        //         // family: 'Courier New' as const,
        //         weight: 'bolder' as const,
        //         size: 11,
        //     },
        // },
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
        <Bar data={returnsChartData} options={options} />
      </ChartWrapper>
    </>
  );
}
