import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

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


export const StockChart = ({ stockData, stockSymbol, buySellSignal}) => {

  const dates = stockData.timestamp.map((timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString()
  );
  const openPrices = stockData.indicators.quote[0].open;
  const closePrices = stockData.indicators.quote[0].close;

  const [strategyValues, setStrategyValues] = useState<number[]>([]);

  // Function to apply the strategy
  const applyStrategy = (openPrices: number[], closePrices: number[], strategy: number[]) => {
    let portfolioValue = closePrices[0]; // Starting portfolio value (could be any number)
    const values = [portfolioValue]; // Store cumulative portfolio values over time
  
    for (let i = 0; i < openPrices.length - 1; i++) {
      const dailyChange = (closePrices[i + 1] - closePrices[i]) / closePrices[i]; // Next day's percentage change
      const position = strategy[i]; // -1: short, 0: hold, 1: buy on current day's signal
  
      portfolioValue += portfolioValue * dailyChange * position; // Apply position to next day's change
      values.push(portfolioValue); // Store updated portfolio value
    }
  
    return values;
  };
  
  useEffect(() => {
    if (openPrices && closePrices) {
      const strategy = buySellSignal;
      const portfolioValues = applyStrategy(openPrices, closePrices, strategy);
      setStrategyValues(portfolioValues);
    }
  }, [openPrices, closePrices]);

  const data = {
    labels: dates,
    datasets: [
      // {
      //   label: 'Open',
      //   data: openPrices,
      //   borderColor: 'rgba(75, 192, 192, 1)',
      //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
      //   fill: false,
      // },
      {
        label: 'Close',
        data: closePrices,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
      {
        label: 'Backtested Strategy',
        data: strategyValues,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
        display: true,
        text: `Stock Data and Simulated Portfolio for ${stockSymbol}`,
      },
    },
  };

  return (
    <div className="mt-10">
      <h2>Stock Data for {stockSymbol}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;
