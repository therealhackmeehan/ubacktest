import React from "react";
import { useState, useEffect, useRef } from "react";
import { Results } from "./Results";
import Editor from '@monaco-editor/react';
import {
  createStrategy,
  getStrategies,
  getSpecificStrategy,
  updateStrategy,
  useQuery,
} from 'wasp/client/operations';
import { type Strategy } from "wasp/entities";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { RenameModal, DeleteModal, NewProjectModal } from "../client/components/Modals";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

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

  const [pythonResponse, setPythonResponse] = useState<string>('');

  const [inputError, setInputError] = useState<boolean>(false);
  const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

  const [pythonError, setPythonError] = useState<boolean>(false);
  const [pythonErrorMessage, setPythonErrorMessage] = useState<string>('');

  const [stockDataError, setStockDataError] = useState<boolean>(false);
  const [stockDataErrorMessage, setStockDataErrorMessage] = useState<string>('');

  const [stratID, setStratID] = useState<string>('');
  const [name, setName] = useState<string>('...');
  const [code, setCode] = useState<string>('...');

  const hasLoadedInitialData = useRef(false); // To track whether we've already loaded the data


  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const handleCloseRenameModal = () => {
    setIsRenameModalOpen(false);
    location.reload();
  }

  // handle delete modal operations
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    location.reload();
  }

  // for the overarching new strategy modal, keep track of function handle and modal state
  const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);
  const handleCloseNewProjectModal = () => {
    setNewProjectModalOpen(false);
    location.reload();
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
    const loadInitialData = async () => {
      if (!hasLoadedInitialData.current && !isStrategiesLoading) {
        const savedValue = localStorage.getItem('projectToLoad');

        if (savedValue) {
          await setNameAndCodeFromID(savedValue);
          localStorage.setItem('projectToLoad', ''); // Clear local storage once data is loaded
        } else if (strategies.length > 0) {
          setStratID(strategies[0].id);
          setName(strategies[0].name);
          setCode(strategies[0].code);
        } else {
          await createStrategy({ name: "My Strategy", code: "Start Editing Your Strategy!!" });
          location.reload();
        }
        hasLoadedInitialData.current = true; // Mark the initial load as complete
      }
    };

    loadInitialData(); // Call the async function

  }, [strategies, isStrategiesLoading]); // Only trigger this when the strategies array or isStrategiesLoading changes

  const runStrategy = async () => {

    // check to make sure inputs exists
    // Check for missing input fields
    if (!startDate || !endDate || !stockSymbol || !intval) {
      setInputErrorMessage('You are missing some input entries.');
      setInputError(true);
      return;
    }

    // Check for valid date format (assuming format is YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      setInputErrorMessage('Date format should be YYYY-MM-DD.');
      setInputError(true);
      return;
    }

    // Check if start date is before end date
    if (new Date(startDate) > new Date(endDate)) {
      setInputErrorMessage('Start date cannot be later than end date.');
      setInputError(true);
      return;
    }

    // Check if symbol is alphanumeric and between 1 and 5 characters (typical for stock symbols)
    const symbolRegex = /^[A-Za-z0-9]{1,5}$/;
    if (!symbolRegex.test(stockSymbol)) {
      setInputErrorMessage('Symbol should be alphanumeric and between 1 to 5 characters.');
      setInputError(true);
      return;
    }

    // Define allowed interval values
    const allowedIntervals = ['1m', '5m', '15m', '30m', '1h', '1d', '1w', '1m', '1y'];

    // Check if intval is one of the allowed values
    if (!allowedIntervals.includes(intval)) {
      setInputErrorMessage("Interval must be one of the following: '1m', '5m', '15m', '30m', '1h', '1d', '1w', '1m', '1y'");
      setInputError(true);
      return;
    }

    // Check if start date and end date are within a reasonable range (e.g., within the last 20 years)
    const today = new Date();
    const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    if (new Date(startDate) < twentyYearsAgo || new Date(endDate) < twentyYearsAgo) {
      setInputErrorMessage('Dates should be within the last 20 years.');
      setInputError(true);
      return;
    }

    // Check if start date and end date are at least 3 days apart
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInDays = (end - start) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    if (differenceInDays < 3) {
      setInputErrorMessage('Start date and end date must be at least 3 days apart.');
      setInputError(true);
      return
    }

    // Check if startDate and endDate are not in the future
    if (new Date(startDate) > today || new Date(endDate) > today) {
      setInputErrorMessage('Dates cannot be in the future.');
      setInputError(true);
      return;
    }

    setInputErrorMessage('');
    setInputError(false);

    setLoading(true);

    try {
      let stockData = await getStockData(stockSymbol, startDate, endDate, intval);
      if (stockData.error) {
        throw (stockData.error);
      }
      stockData = stockData.chart.result;
      setStockData(stockData);
    } catch (e1) {
      setStockDataErrorMessage("Stock Data Retrieval Error!!!");
      setStockDataError(true);
      setLoading(false);
      return;
    }

    try {
      const stockDataForPython = stockData[0].indicators.quote[0];
      const returnedFromPython = await executePythonCode(stockDataForPython, code);
      setPythonResponse(returnedFromPython);
    } catch (e2) {
      setPythonErrorMessage("Error in Executing Python!!!");
      setPythonError(true);
      setLoading(false);
      return;
    }

    setLoading(false);

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

            {inputError &&
              <div className='cursor-pointer text-end items-center border-3 border-red-300 rounded-sm flex hover:bg-red-300 bg-red-100 textrounded-md justify-between gap-3 dark:text-purple-900 p-3 m-3'
                onClick={() => setInputError(false)}>
                {inputErrorMessage}
                <MdOutlineCancel size='1.6rem' />
              </div>
            }

            {pythonError &&
              <div className='cursor-pointer text-end items-center border-3 border-red-300 rounded-sm flex hover:bg-red-300 bg-red-100 textrounded-md justify-between gap-3 dark:text-purple-900 p-3 m-3'
                onClick={() => setPythonError(false)}>
                {pythonErrorMessage}
                <MdOutlineCancel size='1.6rem' />
              </div>
            }

            {stockDataError &&
              <div className='cursor-pointer text-end items-center border-3 border-red-300 rounded-sm flex hover:bg-red-300 bg-red-100 textrounded-md justify-between gap-3 dark:text-purple-900 p-3 m-3'
                onClick={() => setStockDataError(false)}>
                {stockDataErrorMessage}
                <MdOutlineCancel size='1.6rem' />
              </div>
            }

            <div className='grid grid-cols-6 gap-3'>
              <div className="col-span-1 snap-y max-h-96 overflow-auto rounded-md bg-purple-900">
                {isStrategiesLoading && <div className="text-xl font-extrabold text-white">Loading...</div>}
                <h4 className='sticky top-0 rounded-md bg-gray-800/40 font-bold border-b border-gray-500 text-end text-lg tracking-tight p-2 text-white dark:text-white'>
                  Strategies
                </h4>
                {strategies && strategies.length > 0 ? (
                  <ul>
                    {strategies.map((strategy: Strategy) => (
                      <li key={strategy.id} className="flex pl-2 pb-1 pr-2 hover:bg-gray-800">
                        <button
                          type='button'
                          onClick={() => setNameAndCodeFromID(strategy.id)} // Keep the existing button functionality
                          className='w-full truncate text-start hover:tracking-tight text-white hover:font-extrabold '
                        >
                          <div className="flex pt-1 tracking-tight text-xs font-extrabold">
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
                ) : (
                  <div className="flex tracking-tight text-white p-4 text-xs font-extrabold"> No Strategies Found.</div>
                )}
              </div>
              <div className="relative col-span-5">
                {loading && <div className="absolute z-50 m-50 p-50 font-xl text-purple-800 font-extrabold">Loading</div>}
                <div className="bg-purple-900 rounded-md p-3">
                  <div className="flex justify-between pb-2">
                    <div className="flex gap-x-2">
                      <button className='flex gap-x-1 hover:bg-purple-600 items-center rounded-lg p-1 m-1 text-center text-white tracking-tight font-extrabold'>
                        <FaChevronDown />Examples
                      </button>
                      <button className='flex gap-x-1 hover:bg-purple-600 items-center rounded-lg p-1 m-1 text-center text-white tracking-tight font-extrabold'>
                        <FaChevronDown />Ask AI for Help
                      </button>
                      <button className='flex gap-x-1 hover:bg-purple-600 items-center rounded-lg p-1 m-1 text-center text-white tracking-tight font-extrabold'>
                        <FaChevronDown />Libraries Included
                      </button>
                    </div>
                    <button
                      type='button'
                      onClick={saveCodeToDB} // Keep the existing button functionality
                      className='flex rounded-lg p-1 m-1 hover:bg-purple-600 text-center text-white tracking-tight font-light'
                    >
                      <FiSave size='1.6rem' className="pr-2" /> save
                    </button>
                  </div>
                  <Editor className="invert" height="70vh" defaultLanguage='python' theme="vs-dark" value={code} onChange={handleEditorChange}
                    loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stockData && pythonResponse &&
        <Results
          stockData={stockData}
          pythonResponse={pythonResponse}
        />
      }

    </>
  )
}