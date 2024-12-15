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
    const [useLogScale, setUseLogScale] = useState(false);
    const [returnsChartData, setReturnsChartData] = useState<any>({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const processedReturns = useLogScale
            ? stockDataReturns.map((value) => Math.log(Math.abs(value) + 1) * Math.sign(value))
            : stockDataReturns;

        // Process data into bins for histogram
        const binCount = 10 + Math.round(stockDataReturns.length/10); // Number of bins
        const minReturn = Math.min(...processedReturns);
        const maxReturn = Math.max(...processedReturns);
        const binWidth = (maxReturn - minReturn) / binCount;

        const bins = Array(binCount).fill(0); // Array to hold bin frequencies
        processedReturns.forEach((value) => {
            const binIndex = Math.min(
                Math.floor((value - minReturn) / binWidth),
                binCount - 1 // Ensure max values fall into the last bin
            );
            bins[binIndex]++;
        });

        // Generate labels for bins
        const binLabels = bins.map((_, index) => {
            const start = minReturn + index * binWidth;
            const end = start + binWidth;
            return `${(100*start).toFixed()} - ${(100*end).toFixed()}%`;
        });

        // Chart data
        const chartData = {
            labels: binLabels,
            datasets: [
                {
                    label: "Frequency",
                    data: bins,
                    backgroundColor: "rgba(20, 40, 80, 0.3)",
                    borderColor: "rgba(0, 0, 0, 1)",
                    borderWidth: 1,
                },
            ],
        };

        setReturnsChartData(chartData);
    }, [useLogScale, stockDataReturns]);

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="col-span-2 m-4">
            <div className="flex justify-between">
                <div className="text-lg tracking-tight font-bold">Distribution of Returns</div>
                <button
                    className="rounded-md bg-white border-2 border-black text-xs p-1"
                    onClick={() => setUseLogScale(!useLogScale)}
                >
                    {useLogScale ? "Switch to Linear Distribution" : "Switch to Log Distribution"}
                </button>
            </div>
            <Bar data={returnsChartData} options={options} />
        </div>
    );
}
