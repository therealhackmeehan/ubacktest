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

        const newData = {
            labels: dates,
            datasets: [
                {
                    label: 'Open',
                    data: stockData.open,
                    borderColor: 'rgba(123, 50, 168, 1)',
                    backgroundColor: 'rgba(123, 50, 168, 0.2)',
                    fill: false,
                },
                {
                    label: 'Close',
                    data: stockData.close,
                    borderColor: 'rgba(70, 15, 105, 1)',
                    backgroundColor: 'rgba(70, 15, 105, 0.2)',
                    fill: false,
                },
                {
                    label: 'My Strategy',
                    data: stockData.portfolio,
                    borderColor: 'rgba(235, 198, 134, 1)',
                    backgroundColor: 'rgba(235, 198, 134, 0.2)',
                    fill: false,
                },
            ],
        };

        setChartData(newData);
    }, [stockData]); 

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    if (!chartData) {
        return <div className='w-full mt-4 text-center text-xl tracking-tight'>Loading...</div>;
    }

    return <Line className="p-4" data={chartData} options={options} />;
}
