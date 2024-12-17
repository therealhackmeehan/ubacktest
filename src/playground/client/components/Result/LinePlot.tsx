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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function LinePlot({ stockData }: any) {

    const [chartData, setChartData] = useState<any | null>(null);

    useEffect(() => {
        const dates = stockData.timestamp.map((timestamp: number) =>
            new Date(timestamp * 1000).toLocaleDateString()
        );

        const chartData = {
            labels: dates,
            datasets: [
                {
                    label: 'My Strategy',
                    data: stockData.portfolio,
                    borderColor: 'rgba(255, 0, 100, 1)',
                    backgroundColor: 'rgba(255, 0, 100, 1)',
                    pointRadius: 0,
                    yAxisID: 'y1',
                },
                {
                    label: 'Open',
                    data: stockData.open,
                    borderColor: 'rgba(123, 50, 168, 1)',
                    pointRadius: 0,
                    borderDash: [4, 1],
                    tension: .05,
                    hidden: true,
                    yAxisID: 'y1',
                },
                {
                    label: 'Close',
                    data: stockData.close,
                    borderColor: 'rgba(70, 15, 105, 1)',
                    pointRadius: 0,
                    borderDash: [4, 1],
                    tension: .05,
                    yAxisID: 'y1',
                },
                {
                    label: 'Buy/Sell Signal',
                    data: stockData.signal,
                    borderColor: 'rgba(0, 155, 255, 1)',
                    backgroundColor: 'rgba(0, 155, 255, 1)',
                    stepped: true,
                    pointRadius: 0,
                    borderWidth: 1,
                    yAxisID: 'y2',
                },
            ],
        };

        setChartData(chartData);
    }, [stockData]);

    const options = {
        responsive: true,
        layout: {
            padding: 20,
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                },
            },
            y2: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                label: 'Position',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (val: string | number) {
                        if (val === -1) {
                            return 'Short' as const;
                        } else if (val === 0) {
                            return 'No Position' as const;
                        } else if (val === 1) {
                            return 'Buy' as const;
                        }
                        return '' as const;
                    },
                    font: {
                        weight: 'bolder' as const,
                    },
                    color: 'rgba(0, 155, 255, 1)',
                },
                suggestedMin: -1.1,
                suggestedMax: 1.1,
            },
            y1: {
                type: 'linear' as const,
                display: true,
                grid: {
                    color: 'rgba(100,100,100,.1)',
                    lineWidth: 2,
                },
                ticks: {
                    // callback: function (val: number) {
                    //     const toReturn = '$' + val.toFixed(2);
                    //     return toReturn;
                    // },
                },
            },
        },
    };

    if (!chartData) {
        return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    }

    return (
        <div className='col-span-3 border-r-2 border-black bg-slate-50'>
            <div className='font-extralight tracking-tight p-2'>
                See
                <span className='text-lg font-bold mx-2 italic'>
                    how your strategy performed
                </span> alongside the stocks's price.
            </div>

            <Line data={chartData} options={options} />
        </div>
    )
}
