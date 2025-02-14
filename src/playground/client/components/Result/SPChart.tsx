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
import { StrategyResultProps } from '../../../../shared/sharedTypes';
import ChartWrapper from '../../../../client/components/ChartWrapper';

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
                    pointRadius: 0,
                    borderWidth: 1,
                },
                {
                    label: 'S&P 500 Index',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000), // Use Date object for x
                        y: strategyResult.sp[index], // Corresponding y value
                    })),
                    borderColor: 'rgba(123, 50, 168, 1)',
                    pointRadius: 0,
                    borderWidth: 1,
                },
            ],
        };

        setChartData(chartData);
    }, [strategyResult]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
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
                ticks: {
                    callback: (tickValue: string | number) => {
                        const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
                        return '$' + value.toFixed(2);
                    },
                },
                grid: {
                    color: ({ tick }) => tick.value == 1 ? 'rgba(100,100,100,.5)' : 'rgba(100,100,100,0)',
                    lineWidth: 2,
                },
            },
            x: {
                type: 'timeseries' as const,
                grid: {
                    display: false,
                }
            },
        },
    };

    if (!chartData) {
        return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    }

    return (
        <div className="m-2">
            <div className="text-lg tracking-tight font-bold text-sky-700">Did you beat the S&P 500?</div>
            <ChartWrapper height={65}>
                <Line data={chartData} options={options} />
            </ChartWrapper>
        </div>
    );
}

export default SPChart;