import { StrategyResultProps } from "../../../../shared/sharedTypes";
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
    strategyResult: StrategyResultProps;
    timestamp: number[];
}

export default function UserDefinedPlot({ strategyResult, timestamp }: UserDefinedPlotProps) {
    const [chartData, setChartData] = useState<any | null>(null);

    const borderColors: string[] = [
        'rgba(44, 62, 80, 1)',   // Dark Blue-Gray
        'rgba(39, 174, 96, 1)',  // Emerald Green
        'rgba(41, 128, 185, 1)', // Deep Sky Blue
        'rgba(142, 68, 173, 1)', // Dark Purple
        'rgba(231, 76, 60, 1)',  // Cool Red
    ];
    
    useEffect(() => {
        if (!strategyResult.userDefinedData || !strategyResult.signal || !strategyResult.close || !timestamp) return;

        const datasets = Object.entries(strategyResult.userDefinedData)
            .slice(0, 5)
            .map(([key, values], index) => {
                return {
                    label: key,
                    data: values.map((value: number, idx: number) => ({
                        x: new Date(timestamp[idx] * 1000),
                        y: value,
                    })),
                    borderColor: borderColors[index % borderColors.length],
                    stepped: false,
                    hidden: false,
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'y1',
                };
            });

        datasets.push({
            label: "Buy/Sell Signal",
            data: strategyResult.signal.map((value: number, index: number) => ({
                x: new Date(timestamp[index] * 1000),
                y: value,
            })),
            borderColor: 'rgba(0, 155, 255, .6)',
            stepped: true,
            hidden: true,
            pointRadius: 0,
            borderWidth: 2,
            yAxisID: 'y2',
        });

        datasets.push({
            label: "Close Price",
            data: strategyResult.close.map((value: number, index: number) => ({
                x: new Date(timestamp[index] * 1000),
                y: value,
            })),
            borderColor: "rgba(123, 50, 168, 1)",
            stepped: false,
            hidden: true,
            pointRadius: 0,
            borderWidth: 2,
            yAxisID: 'y1',
        });

        setChartData({ datasets });
    }, [strategyResult, timestamp]); // Depend on isNormalized

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
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                type: 'timeseries' as const,
            },
            y1: {
                position: 'left' as const,
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

    if (!chartData) return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    return (
        <ChartWrapper height={65}>
            <Line data={chartData} options={options} />
        </ChartWrapper>
    );

}