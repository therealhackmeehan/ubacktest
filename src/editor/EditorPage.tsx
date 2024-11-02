import React from "react";
import { useState, useEffect, useRef } from "react";
import StockChart from "./Charts";
import Editor from '@monaco-editor/react';

import { type Strategy } from 'wasp/entities';

import {
  createStrategy,
  getStrategies,
  getSpecificStrategy,
  updateStrategy,
  useQuery,
} from 'wasp/client/operations';

import { IoMdAddCircleOutline } from "react-icons/io";

import { RenameModal, DeleteModal } from "../client/components/Modals";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { FaRegEdit, FaChevronRight, FaChevronDown } from "react-icons/fa";


export default function EditorPage() {
  const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [stockSymbol, setStockSymbol] = useState<string>('SPY');
  const [intval, setIntval] = useState<string>('1d');

  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>('');

  const [stratID, setStratID] = useState<string>('');
  const [name, setName] = useState<string>('Untitled_Project');
  const [code, setCode] = useState<string>('# Your Code Here:');

  const hasLoadedInitialData = useRef(false); // To track whether we've already loaded the data

  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const handleCloseRenameModal = () => {
    setIsRenameModalOpen(false);
  }

  // handle delete modal operations
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  }

  const setNameAndCodeFromID = async (savedValue: string) => {
    try {
      const strategy = await getSpecificStrategy({ id: savedValue });
      if (strategy) {
        setStratID(savedValue);
        setName(strategy.name);
        setCode(strategy.code);
      }
    } catch (error) {
      console.error("Failed to load strategy:", error);
    }
  };

  useEffect(() => {
    if (!hasLoadedInitialData.current) {
      const savedValue = localStorage.getItem('projectToLoad');
      if (savedValue) {
        setNameAndCodeFromID(savedValue).then(() => {
          localStorage.setItem('projectToLoad', ''); // Clear local storage once data is loaded
        });
      } else if (strategies) {
        setStratID(strategies[0].id);
        setName(strategies[0].name);
        setCode(strategies[0].code);
      }

      hasLoadedInitialData.current = true; // Mark the initial load as complete
    }
  }, [strategies]); // Only trigger this when the strategies array changes

  const runStrategy = async () => {

    setLoading(true);
    setError(null);
    try {
      const url = `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?period1=${new Date(startDate).getTime() / 1000}&period2=${new Date(endDate).getTime() / 1000}&interval=${intval}`;

      const response = await fetch(url);
      const data = await response.json();

      // Save the stock data to state
      setStockData(data.chart.result[0]);

      const codeResponse = await handlePythonRun();
      console.log(codeResponse)
      setResponse(JSON.parse(codeResponse.run.output));

    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePythonRun = async () => {

    const mainFile = `#
from strategy import myStrategy
import json
import pandas as pd
jsonCodeUnformatted = '${JSON.stringify(stockData.indicators)}'
jsonCodeFormatted = json.loads(jsonCodeUnformatted)
jsonCodeFormatted = jsonCodeFormatted['quote'][0]

df = pd.DataFrame(jsonCodeFormatted)
signalResult = myStrategy(df)
signalResult = signalResult['signal'];
print(str(signalResult.to_json(orient='values')))
`;

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [
          {
            name: "main.py",
            content: mainFile
          },
          {
            name: "strategy.py",
            content: code
          },
        ],
      })
    });

    const output = await response.json();
    return output;
  };


  const handleCreation = async () => {
    try {
      await createStrategy({ name: name, code: code });
      // Reset the name to the updated current date string after submission
    } catch (err: any) {
      window.alert('Error: ' + (err.message || 'Something went wrong'));
    }
  };

  const saveCodeToDB = async () => {
    try {
      await updateStrategy({ id: stratID, code: code });
    } catch (err: any) {
      window.alert('Error: ' + (err.message || 'Something went wrong'));
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    // Check if Ctrl+S or Cmd+S was pressed
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();  // Prevent the default save behavior
      //saveCodeToDB();    // Call your custom save function
      console.log("implement saving w this")
    }
  });

  return (
    <>
      <div className='flex flex-col justify-center gap-10'>
        <div className='lg:mt-10'>
          <div className='mx-auto max-w-screen-2xl px-6 lg:px-8'>
            <div className='flex justify-between py-4'>
              <h4 className='font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white'>
                The <span className='text-purple-500'>Backtest Engine</span> <span className="text-sm"> & Strategy Editor </span>
              </h4>
              <button className='group hover:bg-gray-200 gap-2 flex bg-gray-100 rounded-lg p-1 pr-3 dark:bg-gray-600 dark:border-2 dark:border-white'>
                {/*onClick={() => setNewProjectModalOpen(true)}>*/}
                <IoMdAddCircleOutline size='3rem' className='text-purple-500 group-hover:rotate-6 group-hover:scale-110 duration-500' />
                <span className='font-bold text-xl'>new</span>
              </button>
            </div>
            <div className="bg-purple-900 flex justify-between border-b-8 border-purple-900 rounded-lg">
              <div className="flex pl-4 gap-2 text-white">
                <button className='hover:text-purple-500' title='Delete Strategy'
                  onClick={() => setIsDeleteModalOpen(true)}>
                  <MdDeleteOutline size='1.4rem' />
                </button>

                <DeleteModal isOpen={isDeleteModalOpen}
                  action={handleCloseDeleteModal}
                  id={stratID} />

                <button className='pl-3 hover:text-purple-500' title='Rename Strategy'
                  onClick={() => setIsRenameModalOpen(true)}>
                  <MdOutlineEdit size='1.4rem' />
                </button>

                <RenameModal isOpen={isRenameModalOpen}
                  action={handleCloseRenameModal}
                  id={stratID} />
              </div>
              <h4 className='font-bold text-end tracking-tight pt-3 px-3 pb-1 space-x-2 text-white sm:text-3xl text-xl dark:text-white'>
                <span className="text-base">strategy:</span><span className='text-purple-300 py-12'>{name}</span>
              </h4>
            </div>
            <div className='flex bg-gray-100 rounded-md justify-between gap-3 dark:text-purple-900 px-12 m-4 p-2 mx-2 '>
              <div className='flex items-center justify-between gap-3'>
                <div className="tracking-tight text-xl font-bold">
                  Stock
                </div>
                <input
                  type='text'
                  id='stockSymbol'
                  className='text-sm text-gray-600 w-full rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                  placeholder='Enter stock symbol'
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.currentTarget.value)}
                />
              </div>
              <div className='flex items-center justify-between gap-3'>
                <div className="tracking-tight text-lg font-bold">
                  Start
                </div>
                <input
                  type='date'
                  id='startDate'
                  className='text-sm text-gray-600 w-full rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                  placeholder='Start Date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.currentTarget.value)}
                />
              </div>
              <div className='flex items-center justify-between gap-3'>
                <div className="tracking-tight text-lg font-bold">
                  End
                </div>
                <input
                  type='date'
                  id='endDate'
                  className='text-sm text-gray-600 w-full rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                  placeholder='End Date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.currentTarget.value)}
                />
              </div>
              <div className='flex items-center justify-between gap-3'>
                <div className="tracking-tight text-lg font-bold">
                  Frequency
                </div>
                <input
                  type='text'
                  id='intval'
                  className='text-sm text-gray-600 w-full rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                  placeholder='Set Time Interval'
                  value={intval}
                  onChange={(e) => setIntval(e.currentTarget.value)}
                />
              </div>
              <button
                type='button'
                onClick={runStrategy}
                className='min-w-[7rem] text-2xl border-black border-2 tracking-tight font-extrabold text-purple-800 shadow-md ring-1 ring-inset ring-slate-200 p-1 rounded-md hover:bg-green-200 duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-none'
              >
                GO
              </button>
            </div>
            <div className='grid grid-cols-6 gap-3'>
              <div className="col-span-1 snap-y max-h-96 overflow-auto rounded-md bg-purple-900">
                {isStrategiesLoading && <div className="text-xl font-extrabold text-white">Loading...</div>}
                {strategies && strategies.length > 0 ? (
                  <>
                    <h4 className='sticky top-0 rounded-md bg-gray-800/40 font-bold border-b border-gray-500 text-end text-lg tracking-tight p-2 text-white dark:text-white'>
                      Strategies
                    </h4>
                    <ul>
                      {strategies.map((strategy: Strategy) => (
                        <li key={strategy.id} className="flex pl-2 pb-1 pr-2 hover:bg-gray-800">
                          <button
                            type='button'
                            onClick={() => setNameAndCodeFromID(strategy.id)} // Keep the existing button functionality
                            className='w-full truncate text-start hover:tracking-tight text-white hover:font-extrabold '
                          >
                            <div className="flex font-mono text-sm">
                            {strategy.name}
                            <div className='pl-2 opacity-10'>
                              ---------------------------------------------
                            </div>
                            </div>
                          </button>
                          {(strategy.name === name) && (
                            <div className="flex pr-1 items-center pl-4 text-white">
                              <FaChevronRight size='.4rem' />
                              <FaChevronRight size='.5rem' />
                              <FaChevronRight size='.6rem' />
                            </div>)
                          }
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No strategies found.</p>
                )}
              </div>
              <div className="relative col-span-5">
                <button
                  type='button'
                  onClick={saveCodeToDB} // Keep the existing button functionality
                  className='z-50 absolute right-0 rounded-lg bg-purple-800/80 hover:bg-purple-600 text-center text-white tracking-tight font-extrabold p-3 mr-24 mt-8'
                >
                  Save
                </button>
                <div className="bg-purple-900 rounded-md p-3">
                  <Editor className="invert" height="70vh" defaultLanguage='python' theme="vs-dark" value={code} onChange={handleEditorChange} 
                  loading={ (<div className="text-white font-2xl tracking-tight">Loading...</div>) } />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="mt-12 text-center">
        Results Pane Here and Stuff
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p>{error}</p>}

      {stockData && (
        <>
          <StockChart stockData={stockData} stockSymbol={stockSymbol} buySellSignal={response} />
          <div className="text-bold text-xl">
            Trading Strategy Metrics
            <div>Like Ratio</div>
            <div>Overall Return</div>
            <div>Number of Trading Days</div>
          </div>
          <div className="mt-10">
            <h2>Stock Data for {stockSymbol}</h2>
            <table className='table-auto border-collapse border border-gray-300'>
              <thead>
                <tr>
                  <th className='border px-4 py-2'>Date</th>
                  <th className='border px-4 py-2'>Open</th>
                  <th className='border px-4 py-2'>Close</th>
                </tr>
              </thead>
              <tbody>
                {stockData.timestamp.map((timestamp: number, index: number) => (
                  <tr key={timestamp}>
                    <td className='border px-4 py-2'>{new Date(timestamp * 1000).toLocaleDateString()}</td>
                    <td className='border px-4 py-2'>{Math.round(stockData.indicators.quote[0].open[index])}</td>
                    <td className='border px-4 py-2'>{Math.round(stockData.indicators.quote[0].close[index])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}