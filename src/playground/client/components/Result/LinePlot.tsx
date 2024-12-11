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
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

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
    const [plotShowing, setPlotShowing] = useState<boolean>(false);

    useEffect(() => {
        const dates = stockData.timestamp.map((timestamp: number) =>
            new Date(timestamp * 1000).toLocaleDateString()
        );

        const newData = {
            labels: dates,
            datasets: [
                {
                    label: 'My Strategy',
                    data: stockData.portfolio,
                    borderColor: 'rgba(235, 198, 134, 1)',
                    backgroundColor: 'rgba(235, 198, 134, 0.2)',
                    fill: false,
                },
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
                    label: 'Buy/Sell Signal',
                    data: stockData.signal,
                    borderColor: 'rgba(235, 0, 0, 1)',
                    backgroundColor: 'rgba(235, 198, 134, 0.2)',
                    fill: false,
                }
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

    return (
        <div className='mx-12 rounded-lg border-black border-2 my-8 p-4'>
            <div className="font-bold tracking-tight text-xl text-center p-2 my-2 rounded-md bg-slate-100">
                Simulated Growth of $1
            </div>
            <div className='flex justify-between'>
                <div className='font-extralight tracking-tight'>
                    See
                    <span className='text-lg font-bold mx-2 italic'>
                        how your strategy performed
                    </span> vs. a "buy and hold strategy" for the same stock.
                </div>
                <button className='hover:scale-125 duration-200 p-2 rounded-lg bg-slate-100'
                    onClick={() => setPlotShowing(!plotShowing)}>
                    {plotShowing ?
                        <FiArrowUp /> :
                        <div className='flex items-center text-xs gap-x-2'>expand
                            <FiArrowDown />
                        </div>}
                </button>
            </div>
            {plotShowing && <Line className="m-2 p-2 col-span-2" data={chartData} options={options} />}
        </div>
    )
}
