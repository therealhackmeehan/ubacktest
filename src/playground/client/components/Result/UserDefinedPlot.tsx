import { UserDefinedData } from "../../../../shared/sharedTypes";
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import 'chartjs-adapter-date-fns';

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
} from 'chart.js';
import ChartWrapper from "../../../../client/components/ChartWrapper";

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
    userDefinedData: UserDefinedData;
    timestamp: number[];
}

export default function UserDefinedPlot({ userDefinedData, timestamp }: UserDefinedPlotProps) {
    const [chartData, setChartData] = useState<any | null>(null);

    const borderColors: string[] = [
        'rgba(44, 62, 80, 1)',   // Dark Blue-Gray
        'rgba(39, 174, 96, 1)',  // Emerald Green
        'rgba(41, 128, 185, 1)', // Deep Sky Blue
        'rgba(142, 68, 173, 1)', // Dark Purple
        'rgba(231, 76, 60, 1)',  // Cool Red
    ];

    useEffect(() => {
        if (!userDefinedData || !timestamp) return;

        const datasets = Object.entries(userDefinedData)
            .slice(0, 5)
            .map(([key, values], index) => ({
                label: key,
                data: values
                    .map((value: number, index: number) => ({
                        x: new Date(timestamp[index] * 1000), // Use Date object for x
                        y: value, // Corresponding y value
                    })),
                borderColor: borderColors[index % borderColors.length],
                pointRadius: 1,
                borderWidth: 2,
            }));

        const chartData = { datasets };

        // Update the chart data state
        setChartData(chartData);
    }, [userDefinedData, timestamp]);

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
            mode: 'index' as const,
        },
        plugins: {
            legend: {
                position: 'right' as const,
            },
        },
        scales: {
            x: {
                type: 'timeseries' as const,
            },
        },
    };

    if (!chartData) return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    return (
        <ChartWrapper height={40}>
            <Line data={chartData} options={options} />
        </ChartWrapper>
    );

}