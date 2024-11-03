import React from "react";
import { useState, useEffect, useRef } from "react";
import { Results } from "./Results";
import Editor from '@monaco-editor/react';
import {
  getStrategies,
  getSpecificStrategy,
  updateStrategy,
  useQuery,
} from 'wasp/client/operations';
import { type Strategy } from "wasp/entities";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RenameModal, DeleteModal, NewProjectModal } from "../client/components/Modals";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";

import getStockData from "../server/getStockData";
import executePythonCode from "../server/executePythonCode";

export default function EditorPage() {
  const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);

  const [startDate, setStartDate] = useState<string>('2020-02-02');
  const [endDate, setEndDate] = useState<string>('2020-05-02');
  const [stockSymbol, setStockSymbol] = useState<string>('SPY');
  const [intval, setIntval] = useState<string>('1d');

  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pythonResponse, setPythonResponse] = useState<string>('');

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

  // for the overarching new strategy modal, keep track of function handle and modal state
  const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);
  const handleCloseNewProjectModal = () => {
    setNewProjectModalOpen(false);
  };



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
      // Fetch stock data
      let stockData = await getStockData(stockSymbol, startDate, endDate, intval);
      if (stockData.error) {
        throw(stockData.error);
      }
      stockData = stockData.chart.result;
      setStockData(stockData);

      const stockDataForPython = stockData[0].indicators.quote[0];

      // Run the strategy in Python and set response
      const returnedFromPython = await executePythonCode(stockDataForPython, code);
      setPythonResponse(returnedFromPython);

    } catch (error) {
      // Improved error handling
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
      setError(`Error: ${errorMessage}`);
      console.error("Error occurred:", errorMessage);
    } finally {
      setLoading(false);
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
              <button className='group hover:bg-gray-200 gap-2 flex bg-gray-100 rounded-lg p-1 pr-3 dark:bg-gray-600 dark:border-2 dark:border-white'
                onClick={() => setNewProjectModalOpen(true)}>
                <IoMdAddCircleOutline size='3rem' className='text-purple-500 group-hover:rotate-6 group-hover:scale-110 duration-500' />
                <span className='font-bold text-xl'>new</span>
              </button>

              <NewProjectModal
                isOpen={newProjectModalOpen}
                action={handleCloseNewProjectModal}
                id={''} //not applicable
              />

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
                            <div className="flex tracking-tight text-xs font-extrabold">
                              {strategy.name}
                              <div className='pl-2 opacity-10'>
                                ---------------------------------------------
                              </div>
                            </div>
                          </button>
                          {(strategy.name === name) && (
                            <div className="flex pr-1 items-center opacity-25 pl-4 text-white">
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
                {loading && <div className="absolute z-50 m-50 p-50 font-xl text-purple-800 font-extrabold">Loading</div>}
                <div className="bg-purple-900 rounded-md p-3">
                  <Editor className="invert" height="70vh" defaultLanguage='python' theme="vs-dark" value={code} onChange={handleEditorChange}
                    loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : stockData && pythonResponse ? (
        <Results
          stockData={stockData}
          pythonResponse={pythonResponse}
        />
      ) : null /* Optional: Define any additional case if needed */}

    </>
)}