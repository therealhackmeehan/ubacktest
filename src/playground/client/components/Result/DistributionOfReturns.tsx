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

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DistributionOfReturns({ stockDataReturns }: { stockDataReturns: number[] }) {
    const [returnsChartData, setReturnsChartData] = useState<any>({
        labels: [],
        datasets: [],
    });

    const [stdDev, setStdDev] = useState<number | null>(null)
    const [avg, setAvg] = useState<number | null>(null);

    useEffect(() => {
        // Calculate stdev
        setStdDev(3);
        setAvg(2);

        // Process normal data
        const binCount = 10 + Math.round(stockDataReturns.length / 10); // Number of bins
        const minReturn = Math.min(...stockDataReturns);
        const maxReturn = Math.max(...stockDataReturns);
        const binWidth = (maxReturn - minReturn) / binCount;

        const binsNormal = Array(binCount).fill(0); // Normal data bins
        stockDataReturns.forEach((value) => {
            const binIndex = Math.min(
                Math.floor((value - minReturn) / binWidth),
                binCount - 1 // Ensure max values fall into the last bin
            );
            binsNormal[binIndex]++;
        });

        // Process log-transformed data
        const logTransformedReturns = stockDataReturns.map(
            (value) => Math.log(Math.abs(value) + 1) * Math.sign(value)
        );
        const minLog = Math.min(...logTransformedReturns);
        const maxLog = Math.max(...logTransformedReturns);
        const logBinWidth = (maxLog - minLog) / binCount;

        const binsLog = Array(binCount).fill(0); // Log data bins
        logTransformedReturns.forEach((value) => {
            const binIndex = Math.min(
                Math.floor((value - minLog) / logBinWidth),
                binCount - 1 // Ensure max values fall into the last bin
            );
            binsLog[binIndex]++;
        });

        // Generate labels for bins (use the normal data bins for labels)
        const binLabels = binsNormal.map((_, index) => {
            const start = minReturn + index * binWidth;
            const num = (100 * start).toFixed();
            return `${num}%`;
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
                },
                {
                    label: "log(returns)",
                    data: binsLog,
                    backgroundColor: "rgba(100, 150, 200, 0.3)",
                    borderColor: "rgba(100, 150, 200, 1)",
                    borderWidth: 1,
                },
            ],
        };

        setReturnsChartData(chartData);
    }, [stockDataReturns]);

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true, // Show legend to differentiate datasets
            },
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    align: 'end' as const,
                },
                offset: true, // Align the bars with the ticks
            },
            y: {
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className="col-span-2 m-4">
            <div className="flex justify-between items-center">
                <div className="text-lg tracking-tight font-bold">Distribution of Returns</div>
                <div className="flex justify-items-center gap-x-2">
                    {stdDev && <div className="text-xs p-1 bg-white rounded-md font-light">
                        Standard Deviation: {stdDev}
                    </div>}
                    {avg && <div className="text-xs p-1 bg-white rounded-md font-light">
                        Mean: {avg}
                    </div>}
                </div>
            </div>
            <Bar data={returnsChartData} options={options} />
        </div>
    );
}
