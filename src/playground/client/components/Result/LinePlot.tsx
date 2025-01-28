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

interface LinePlotProps {
    strategyResult: StrategyResultProps;
    costPerTrade: number;
    minDate: string | null;
}

function LinePlot({ strategyResult, costPerTrade, minDate }: LinePlotProps) {

    const [chartData, setChartData] = useState<any | null>(null);

    useEffect(() => {

        const chartData = {
            datasets: [
                {
                    label: 'My Strategy',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000), // Use Date object for x
                        y: strategyResult.portfolio[index], // Corresponding y value
                    })),
                    borderColor: 'rgba(255, 0, 100, 1)',
                    backgroundColor: 'rgba(255, 0, 100, 1)',
                    pointRadius: 1,
                    borderWidth: 1,
                    yAxisID: 'y1',
                },
                {
                    label: 'Open',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000),
                        y: strategyResult.open[index],
                    })),
                    borderColor: 'rgba(123, 50, 168, 1)',
                    pointRadius: 0,
                    borderWidth: 1,
                    borderDash: [4, 1],
                    tension: 0.05,
                    hidden: true,
                    yAxisID: 'y1',
                },
                {
                    label: 'Close',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000),
                        y: strategyResult.close[index],
                    })),
                    borderColor: 'rgba(70, 15, 105, 1)',
                    pointRadius: 0,
                    borderWidth: 1,
                    borderDash: [4, 1],
                    tension: 0.05,
                    yAxisID: 'y1',
                },
                {
                    label: 'Buy/Sell Signal',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000),
                        y: strategyResult.signal[index],
                    })),
                    borderColor: 'rgba(0, 155, 255, 1)',
                    backgroundColor: 'rgba(0, 155, 255, 1)',
                    stepped: true,
                    pointRadius: 0,
                    borderWidth: 1,
                    yAxisID: 'y2',
                },
                {
                    label: 'My Strategy (w/ trading costs)',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000),
                        y: strategyResult.portfolioWithCosts[index],
                    })),
                    borderColor: 'rgba(255, 0, 100, 0.6)',
                    backgroundColor: 'rgba(255, 0, 100, 0.6)',
                    borderWidth: 1,
                    hidden: true,
                    pointRadius: 0,
                    yAxisID: 'y1',
                },
            ],
        };


        // Conditionally add the "My Strategy (w trading costs)" dataset
        if (costPerTrade === 0) {
            chartData.datasets.pop();
        }

        setChartData(chartData);
    }, [strategyResult]);

    const options = {
        responsive: true,
        aspectRatio: 2 / 1,
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
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                ...(minDate && { min: minDate }), // Conditionally include 'min'
                type: 'timeseries' as const,
            },
            y1: {
                ticks: {
                    callback: (tickValue: string | number) => {
                        const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
                        return '$' + value.toFixed(2);
                    }
                },
                grid: {
                    color: (tick) => { // IDK why this exists at tick.tick.value
                        return tick.tick.value === 1 ? 'rgba(100,100,100,.4)' : 'rgba(100,100,100,.1)';
                    },
                    lineWidth: 1,
                },
            },
            y2: {
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
        },
    };

    if (!chartData) {
        return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    }

    return (
        <div className='col-span-3 bg-slate-50'>
            <Line data={chartData} options={options} />
        </div>
    )
}

export default LinePlot;