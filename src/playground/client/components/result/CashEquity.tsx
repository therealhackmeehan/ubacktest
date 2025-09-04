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

interface CashEquityProps {
    strategyResult: StrategyResultProps;
}
function CashEquity({ strategyResult }: CashEquityProps) {

    const [chartData, setChartData] = useState<any | null>(null);

    useEffect(() => {
        let chartData = {
            datasets: [
                {
                    label: 'Cash Value',
                    data: strategyResult.timestamp.map((timestamp: string, index: number) => ({
                        x: new Date(timestamp),
                        y: strategyResult.cash[index],
                    })),
                    borderColor: 'rgba(255, 69, 0, 1)', // Bold Red-Orange  
                    backgroundColor: 'rgba(255, 69, 0, 1)',
                    pointRadius: 0,
                    borderWidth: 1,
                    stepped: true,
                },
                {
                    label: 'Equity Value',
                    data: strategyResult.timestamp.map((timestamp: string, index: number) => ({
                        x: new Date(timestamp),
                        y: strategyResult.equity[index],
                    })),
                    borderColor: 'rgba(34, 139, 34, 1)', // Deep Forest Green  
                    backgroundColor: 'rgba(34, 139, 34, 1)',
                    pointRadius: 0,
                    borderWidth: 1,
                    stepped: true,
                },
                {
                    label: 'abs(Equity Value)',
                    data: strategyResult.timestamp.map((timestamp: string, index: number) => ({
                        x: new Date(timestamp),
                        y: Math.abs(strategyResult.equity[index]),
                    })),
                    borderColor: 'rgba(0, 128, 255, 1)', // Vivid Blue  
                    backgroundColor: 'rgba(0, 128, 255, 1)',
                    pointRadius: 0,
                    borderWidth: 1,
                    stepped: true,
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
                    color: ({ tick }) => tick.value == 0 ? 'rgba(100,100,100,.5)' : 'rgba(100,100,100,.1)',
                    lineWidth: 2,
                },
            },
            x: {
                type: 'timeseries' as const,
            },
        },
    };

    if (!chartData) {
        return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    }

    return (
        <div className="m-2">
            <div className="text-lg tracking-tight font-bold text-sky-700">
                Cash/Equity Breakdown
                <span className="text-xs font-mono m-2 text-black/50">
                    (equity may be negative if you’ve shorted the stock)
                </span>
            </div>
            <ChartWrapper height={40}>
                <Line data={chartData} options={options} />
            </ChartWrapper>
        </div>
    );
}

export default CashEquity;