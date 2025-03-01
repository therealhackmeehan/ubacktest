import { Chart } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { StrategyResultProps } from '../../../../shared/sharedTypes';
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";

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
    CandlestickController,
    CandlestickElement,
    zoomPlugin
);

interface LinePlotProps {
    strategyResult: StrategyResultProps;
    costPerTrade: number;
    minDate: string | null;
    symbol: string;
}

function CandlePlot({ strategyResult, costPerTrade, minDate, symbol }: LinePlotProps) {

    const [chartData, setChartData] = useState<any | null>(null);

    useEffect(() => {

        const chartData = {
            datasets: [
                {
                    type: 'line',
                    label: 'My Strategy',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000), // Use Date object for x
                        y: strategyResult.portfolio[index], // Corresponding y value
                    })),
                    borderColor: 'rgba(0, 0, 0, .8)',
                    backgroundColor: 'rgba(0, 0, 0, .8)',
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'y1',
                    tension: .05,
                },
                {
                    type: 'candlestick',
                    label: symbol.toUpperCase(),
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000).valueOf(), // Convert timestamp to Date
                        o: strategyResult.open[index], // Open price
                        h: strategyResult.high[index], // High price
                        l: strategyResult.low[index],  // Low price
                        c: strategyResult.close[index] // Close price
                    })),
                    yAxisID: 'y1'
                },
                {
                    type: 'line',
                    label: 'Buy/Sell Signal',
                    data: strategyResult.timestamp.map((timestamp: number, index: number) => ({
                        x: new Date(timestamp * 1000),
                        y: strategyResult.signal[index],
                    })),
                    borderColor: 'rgba(0, 155, 255, .6)',
                    backgroundColor: 'rgba(0, 155, 255, .6)',
                    stepped: true,
                    pointRadius: 0,
                    borderWidth: 1,
                    yAxisID: 'y2',
                },
                {
                    type: 'line',
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
        maintainAspectRatio: false,
        layout: {
            padding: 20,
        },
        animation: strategyResult.timestamp.length > 365 ? false : {},
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        const value = context.raw;

                        // Check if the raw value contains OHLC data
                        if (value.o !== undefined && value.h !== undefined && value.l !== undefined && value.c !== undefined) {
                            const o = value.o;
                            const h = value.h;
                            const l = value.l;
                            const c = value.c;

                            return `${label} | Open: $${o} High: $${h} Low: $${l} Close: $${c}`;
                        }

                        // Default case
                        return `${label}: ${value.y.toFixed(3)}`;
                    },
                },
            },
            legend: {
                position: 'top' as const,
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x' as const,
                },
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
                    color: 'rgba(0, 155, 255, .6)',
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
        <ChartWrapper height={65}>
            <Chart type="candlestick" data={chartData} options={options} />
        </ChartWrapper>
    )
}

export default CandlePlot;