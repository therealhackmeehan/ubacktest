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

interface RatiosBarChartProps {
    sortino: string | null;
    sharpe: string | null;
}

function RatiosBarChart({ sortino, sharpe }: RatiosBarChartProps) {
    // Chart data

    const chartData = {
        labels: ["Sharpe Ratio", "Sortino Ratio"],
        datasets: [
            {
                label: "Ratios",
                data: [sharpe, sortino],
                backgroundColor: [
                    "rgba(0, 0, 0, 0.5)",
                    "rgba(20, 20, 0, 0.5)",
                ],
                borderColor: [
                    "rgba(0, 0, 0, 1)",
                    "rgba(0, 0, 0, 1)",
                ],
                borderWidth: 1,
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
            title: {
                display: false,
                text: "Sharpe and Sortino Ratios",
            },
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: false,
                    text: "Metrics",
                },
            },
            y: {
                grid: {
                    lineWidth: 1,
                    color: (tick) => {
                        return tick.tick.value === 0 ? 'rgba(100,100,100,.4)' : 'rgba(100,100,100,.1)';
                    },
                },
                title: {
                    display: false,
                    text: "Value",
                },
                beginAtZero: true,
                suggestedMin: -.1,
                suggestedMax: .1,
            },
        },
    };

    return (
        <div className="col-span-2 m-4">
            <div className="text-lg tracking-tight font-bold">Risk Ratios</div>
            {(sharpe && sortino) ? <Bar data={chartData} options={options} /> :
                <div className="p-4">Invalid Sharpe/Sortino Ratios.</div>}
        </div>
    );
}

export default RatiosBarChart;