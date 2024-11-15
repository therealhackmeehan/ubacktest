import { Line } from 'react-chartjs-2';
import { FiShare, FiSave } from "react-icons/fi";
import { MdOutlineTransitEnterexit } from "react-icons/md";
import { IoCloudDownloadOutline } from "react-icons/io5";

import { useState } from 'react';

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

export default function ChartAndStats({ stockData }: { stockData: any }) {

  debugger
  const exampleStat = '12.3%';
  const [resultOpen, setResultOpen] = useState<boolean>(true);

  const dates = stockData[0].timestamp.map((timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString()
  );

  const indicators = stockData[0].indicators;
  const openPrices = indicators.quote[0].open;
  const closePrices = indicators.quote[0].close;
  const portfolioValues = indicators.quote[0].portfolio;
  const volumes = indicators.quote[0].volume;
  const adjClosePrices = indicators.adjclose[0];

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Open',
        data: openPrices,
        borderColor: 'rgba(123, 50, 168, 1)',
        backgroundColor: 'rgba(123, 50, 168, 0.2)',
        fill: false,
      },
      {
        label: 'Close',
        data: closePrices,
        borderColor: 'rgba(70, 15, 105, 1)',
        backgroundColor: 'rgba(70, 15, 105, 0.2)',
        fill: false,
      },
      {
        label: 'Backtested Strategy',
        data: portfolioValues,
        borderColor: 'rgba(235, 198, 134, 1)',
        backgroundColor: 'rgba(235, 198, 134, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: `Stock Data and Simulated Portfolio for ${symbol}`,
      },
    },
  };

  return (
    <>
      {resultOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-500 w-full opacity-75 fixed inset-0"></div>
          <div className="bg-white rounded-lg shadow-lg z-10 border-purple-600 border-1 shadow-md shadow-purple-900 rounded-xl">
            <div className='flex -mr-2 -mt-2 justify-end'>
              <button className='bg-red-500 rotate-180 rounded-full text-white' onClick={() => setResultOpen(false)}>
                <MdOutlineTransitEnterexit size='2rem' />
              </button>
            </div>
            <div className='items-center flex m-2 justify-between'>
              <h4 className="tracking-tight text-xl font-extrabold text-left m-4">
                Stock Data and Simulated Backtest Portfolio for {symbol}
              </h4>
              <div className='flex'>
                <button className='p-2 m-1 tracking-tight hover:bg-purple-900 rounded-md bg-purple-700 text-white font-light'><FiSave /></button>
                <button className='p-2 m-1 tracking-tight hover:bg-purple-900 rounded-md bg-purple-700 text-white font-light'><IoCloudDownloadOutline /></button>
                <button className='p-2 m-1 tracking-tight hover:bg-purple-900 rounded-md bg-purple-700 text-white font-light'><FiShare /></button>
                <button className='p-2 m-1 tracking-tight hover:bg-purple-900 rounded-md bg-purple-700 text-white font-light'>
                  Implement With Real Money
                  <span className="pl-1 text-xs font-extrabold tracking-tight uppercase align-top">
                    (Beta)
                  </span>
                </button>
              </div>
            </div>
            <Line className='p-4' data={data} options={options} />
            <div className='bg-purple-900 flex justify-between rounded-lg rounded-t-none'>
              <StatBox stat={exampleStat} text='Sharpe Ratio' />
              <StatBox stat={exampleStat} text='Sortino Ratio' />
              <StatBox stat={exampleStat} text='Number of Trades' />
              <StatBox stat={exampleStat} text='Overall Profit/Loss' />
              <StatBox stat={exampleStat} text='Overall Profit/Loss (Annualized)' />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface statBoxProps {
  stat: string;
  text: string;
}

function StatBox({ stat, text }: statBoxProps) {
  return (
    <div className='bg-slate-200 rounded-lg p-3 m-2'>
      <div className="flex tracking-tight text-lg text-purple-900 font-bold gap-2 text-gray-800">{text}</div>
      <div className='font-extralight tracking-loose'>{stat}</div>
    </div>
  )
}