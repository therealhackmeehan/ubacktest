import { useState } from "react";
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

interface DistributionOfReturnsProps {
    stockDataReturns: number[];
}

export default function DistributionOfReturns({ stockDataReturns }: DistributionOfReturnsProps) {
    const [useLogScale, setUseLogScale] = useState(false);

    // Process data into bins for histogram
    const binCount = 10; // Number of bins
    const minReturn = Math.min(...stockDataReturns);
    const maxReturn = Math.max(...stockDataReturns);
    const binWidth = (maxReturn - minReturn) / binCount;

    const bins = Array(binCount).fill(0); // Array to hold bin frequencies
    stockDataReturns.forEach((value) => {
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
        return `${start.toFixed(2)} - ${end.toFixed(2)}`;
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
                borderWidth: 3,
            },
        ],
    };

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
                    className="rounded-md bg-white border-2 border-black text-sm p-2"
                    onClick={() => setUseLogScale(!useLogScale)}
                >
                    {useLogScale ? "Switch to Linear Distribution" : "Switch to Log Distribution"}
                </button>
            </div>
            <Bar data={chartData} options={options} />
        </div>
    );
}
