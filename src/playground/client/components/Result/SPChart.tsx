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
    TimeScale
} from 'chart.js';
import { StrategyResultProps } from '../../../../shared/sharedTypes';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

function SPChart({ strategyResult }: { strategyResult: StrategyResultProps }) {

    const [chartData, setChartData] = useState<any | null>(null);

    useEffect(() => {
        let chartData = {
            datasets: [
                {
                    label: 'My Strategy',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000), // Use Date object for x
                        y: strategyResult.portfolio[index], // Corresponding y value
                    })), 
                    borderColor: 'rgba(255, 0, 100, 1)',
                    backgroundColor: 'rgba(255, 0, 100, 1)',
                    pointRadius: 2,
                    borderWidth: 2,
                },
                {
                    label: 'S&P 500 Index',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000), // Use Date object for x
                        y: strategyResult.sp[index], // Corresponding y value
                    })), 
                    borderColor: 'rgba(123, 50, 168, 1)',
                    pointRadius: 0,
                },
            ],
        };

        setChartData(chartData);
    }, [strategyResult]);

    const options = {
        responsive: true,
        animation: {
            duration: 0,
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
            y: {
                grid: {
                    color: ({ tick }) => tick.value == 1 ? 'rgba(100,100,100,.5)' : 'rgba(100,100,100,.05)',
                    lineWidth: 2,
                },
            },
            x: {
                type: 'time' as const,
            },
        },
    };

    if (!chartData) {
        return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    }

    return <Line data={chartData} options={options} />;
}

export default SPChart;