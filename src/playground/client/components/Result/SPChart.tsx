import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { StrategyResultProps } from '../../../../shared/sharedTypes';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function SPChart({ strategyResult }: { strategyResult: StrategyResultProps }) {

    const [chartData, setChartData] = useState<any | null>(null);

    useEffect(() => {
        const dates = strategyResult.timestamp.map((timestamp: number) =>
            new Date(timestamp * 1000).toLocaleDateString()
        );

        let chartData = {
            labels: dates,
            datasets: [
                {
                    label: 'My Strategy',
                    data: strategyResult.portfolio,
                    borderColor: 'rgba(255, 0, 100, 1)',
                    backgroundColor: 'rgba(255, 0, 100, 1)',
                    pointRadius: 0,
                },
                {
                    label: 'S&P 500 Index',
                    data: strategyResult.sp,
                    borderColor: 'rgba(123, 50, 168, 1)',
                    pointRadius: 0,
                },
            ],
        };

        setChartData(chartData);
    }, [strategyResult]);

    const options = {
        responsive: true,
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
                type: 'linear' as const,
                display: true,
                grid: {
                    color: ({ tick }) => tick.value == 1 ? 'rgba(100,100,100,.5)' : 'rgba(100,100,100,.05)',
                    lineWidth: 2,
                },
            },
        },
    };

    if (!chartData) {
        return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    }

    return <Line data={chartData} options={options} />;
}

export default SPChart;