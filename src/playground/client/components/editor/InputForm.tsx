import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import { FormInputProps } from "../../../../shared/sharedTypes";
import { IoMdReturnRight } from "react-icons/io";
import { CgArrowUp } from "react-icons/cg";
import { GiInvertedDice5 } from "react-icons/gi";
import { BiReset } from "react-icons/bi";
import { initFormInputs } from "../initFormInputs";
import { addMonths } from "../../scripts/addMonths";
import { VscGrabber } from "react-icons/vsc";
import stocks from "./stocksInSP";
import { intVals, eodFreqs } from "../../../../shared/sharedTypes";

interface InputFormSubcomponentProps {
  formInputs: FormInputProps;
  setFormInputs: React.Dispatch<React.SetStateAction<FormInputProps>>;
  run: () => Promise<void>;
}

export interface Stock {
  Symbol: string;
  Security: string;
  "GICS Sector": string;
  "GICS Sub-Industry": string;
  "Headquarters Location": string;
  "Date added": string;
  CIK: number;
  Founded: number | string;
}

const INPUT_FORM_HEIGHT = "inputFormHeight";

function InputForm({
  formInputs,
  setFormInputs,
  run,
}: InputFormSubcomponentProps) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [displayAdvancedOptions, setDisplayAdvancedOptions] =
    useState<boolean>(false);
  const [matches, setMatches] = useState<Stock[]>([]);
  const [displayMatches, setDisplayMatches] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormInputs((prevInputs: FormInputProps) => ({
      ...prevInputs,
      [name]: value,
    }));

    // Symbol filtering logic (remains unchanged)
    if (name === "symbol") {
      if (value.trim()) {
        const filteredMatches: Stock[] = stocks
          .filter(
            (stock: Stock) =>
              stock["Symbol"].toLowerCase().startsWith(value.toLowerCase()) ||
              stock["Security"].toLowerCase().startsWith(value.toLowerCase())
          )
          .slice(0, 4);

        setMatches(filteredMatches);
        setDisplayMatches(true);

        // Clear previous timeout if it exists
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setDisplayMatches(false);
        }, 3000);
      } else {
        setMatches([]); // Clear matches if input is empty
        setDisplayMatches(false);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    }
  };

  const handleSelect = (symbol: string) => {
    // Update form inputs with selected symbol and clear matches
    setFormInputs((prevInputs: FormInputProps) => ({
      ...prevInputs,
      symbol,
    }));
    setMatches([]);
  };

  const randomFormInputs = () => {
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];

    const today = new Date();

    // Generate two distinct random numbers between 1 and 25
    let startOffset = 1 + Math.floor(Math.random() * 25);
    let endOffset = 1 + Math.floor(Math.random() * 25);

    // Ensure they are different
    while (startOffset === endOffset) {
      endOffset = 1 + Math.floor(Math.random() * 25);
    }

    // Ensure start date is before end date
    const [newStartOffset, newEndOffset] =
      startOffset > endOffset
        ? [startOffset, endOffset]
        : [endOffset, startOffset];

    const newStartDate = addMonths(today, -newStartOffset);
    const newEndDate = addMonths(today, -newEndOffset);
    const newWarmupDate = addMonths(new Date(newStartDate), -1);

    setFormInputs({
      ...formInputs,
      symbol: randomStock["Symbol"],
      startDate: newStartDate,
      endDate: newEndDate,
      warmupDate: newWarmupDate,
    });
  };

  const resetFormInputs = () => {
    setFormInputs(initFormInputs);
  };

  const [position, setPosition] = useState<{ y: number }>(() => {
    const savedPosition = localStorage.getItem(INPUT_FORM_HEIGHT);
    const initialPosition = savedPosition
      ? JSON.parse(savedPosition)
      : { y: 200 };

    // Ensure y is within the visible screen bounds
    const clampedY = Math.min(
      Math.max(initialPosition.y, 0),
      window.innerHeight - 100
    ); // 50px buffer

    return { y: clampedY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ y: 0 });

  useEffect(() => {
    localStorage.setItem(INPUT_FORM_HEIGHT, JSON.stringify(position));
  }, [position]);

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    offset.current = { y: clientY - position.y };
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const newY = clientY - offset.current.y;
    const clampedY = Math.max(
      0,
      Math.min(newY, window.innerHeight - window.innerHeight / 3)
    );

    setPosition({ y: clampedY });
  };

  const handleUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleUp);
    } else {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
    };
  }, [isDragging]);

  useEffect(() => {
    localStorage.setItem(INPUT_FORM_HEIGHT, JSON.stringify(position));
  }, [position]);

  return (
    <div
      className="z-10 flex border-2 border-black dark:border-blue-300 flex-col shadow-lg justify-between rounded-lg fixed bg-gradient-to-br from-white to-slate-100 p-4 dark:bg-gradient-to-br dark:from-boxdark dark:to-boxdark-2 dark:text-white"
      style={{
        right: "3rem",
        top: `${position.y}px`,
        position: "fixed",
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <button
        className="rounded-md -mt-3 mb-1 hover:cursor-grab active:cursor-grabbing"
        onMouseDown={handleDown}
        onTouchStart={handleDown}
      >
        <VscGrabber className="mx-auto" />
      </button>
      <div className="space-y-3 overflow-auto px-1">
        <div className="flex justify-between items-center gap-x-4 overflow-hidden">
          <button
            className={`hover:text-sky-700 duration-500 hover:bg-gradient-to-br from-white to-slate-300 dark:to-black p-1 border-2 border-slate-300 rounded-md m-1 dark:text-white ${
              expanded ? "" : "rotate-180"
            }`}
            onClick={() => setExpanded(!expanded)}
          >
            <CgArrowUp />
          </button>

          <div className="text-lg text-slate-800 tracking-tight font-extrabold text-nowrap dark:text-white">
            <span className="text-sm font-light text-sky-700 dark:text-blue-300">
              the
            </span>{" "}
            Backtest Engine
          </div>
        </div>

        {expanded && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="tracking-tight text-xs font-bold">Symbol</div>
              <input
                type="text"
                maxLength={5}
                minLength={1}
                className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                value={formInputs.symbol}
                onChange={handleChange}
                name="symbol"
                autoComplete="off"
              />
            </div>

            {matches.length > 0 && displayMatches && (
              <ul className="text-xs z-10 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto text-black">
                {matches.map((match: Stock) => (
                  <li
                    key={match["Symbol"]}
                    onClick={() => handleSelect(match["Symbol"])}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {match["Symbol"]} -{" "}
                    <span className="font-extralight">{match["Security"]}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between gap-12">
              <div className="tracking-tight text-xs font-bold">Start Date</div>
              <input
                type="date"
                className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                value={formInputs.startDate}
                onChange={handleChange}
                name="startDate"
              />
            </div>
            <div className="flex items-center justify-between gap-12">
              <div className="tracking-tight text-xs font-bold">End Date</div>
              <input
                type="date"
                className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                value={formInputs.endDate}
                onChange={handleChange}
                name="endDate"
              />
            </div>
            <div className="flex items-center justify-between gap-12">
              <div className="tracking-tight text-xs font-bold">
                Trading Frequency
              </div>
              <select
                className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                value={formInputs.intval}
                onChange={handleChange}
                name="intval"
              >
                {intVals.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex text-xs bg-gradient-to-r from-white to-sky-700 dark:to-blue-300 rounded-md border-2 border-sky-700 dark:border-0">
              <button
                className="w-full rounded-l-md p-0.5 flex gap-x-1 items-center justify-center hover:bg-slate-50 group dark:text-black"
                onClick={randomFormInputs}
              >
                random{" "}
                <GiInvertedDice5 className="group-hover:rotate-180 duration-500" />
              </button>
              <button
                className="w-full border-l-2 border-sky-700 dark:border-boxdark-2 rounded-r-md p-0.5 flex gap-x-1 items-center justify-center hover:bg-slate-50 group hover:text-black text-white dark:text-black"
                onClick={resetFormInputs}
              >
                reset{" "}
                <BiReset className="group-hover:rotate-180 duration-500" />
              </button>
            </div>

            <button
              className="flex hover:font-bold items-center justify-self-center text-xs text-sky-700 dark:text-blue-300"
              onClick={() => setDisplayAdvancedOptions(!displayAdvancedOptions)}
            >
              advanced options
              {displayAdvancedOptions ? (
                <FaCaretUp size="1rem" />
              ) : (
                <FaCaretDown size="1rem" />
              )}
            </button>

            {displayAdvancedOptions && (
              <>
                <div className="space-y-1 border-2 border-white bg-slate-100 rounded-md p-2 dark:bg-boxdark-2 w-100">
                  {eodFreqs.includes(formInputs.intval) && (
                    <div className="flex items-center justify-between gap-3">
                      <div className="tracking-tight text-xs font-light">
                        Use Adjusted Close Prices
                      </div>
                      <div className="flex items-center gap-x-1">
                        <input
                          type="checkbox"
                          className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                          checked={formInputs.useAdjClose}
                          onChange={(e) => {
                            setFormInputs((prevInputs: FormInputProps) => ({
                              ...prevInputs,
                              useAdjClose: !prevInputs.useAdjClose, // Sets to true or false based on checkbox state
                            }));
                          }}
                          name="useAdjClose"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="tracking-tight text-xs font-light">
                      Cost Per Trade
                    </div>
                    <div className="flex items-center gap-x-1">
                      <input
                        type="number"
                        step={0.01}
                        min={0}
                        max={100}
                        className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                        value={formInputs.costPerTrade}
                        onChange={handleChange}
                        name="costPerTrade"
                      />
                      <div className="font-extralight">%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="tracking-tight text-xs font-light">
                      Exec. Time Limit
                    </div>
                    <div className="flex items-center gap-x-1">
                      <input
                        type="number"
                        step={5}
                        min={1}
                        max={60}
                        className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                        value={formInputs.timeout}
                        onChange={handleChange}
                        name="timeout"
                      />
                      <div className="font-extralight">s</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 border-2 border-white bg-slate-200 rounded-md p-2 dark:bg-boxdark-2">
                  <div className="flex py-2 items-center justify-between gap-3">
                    <div className="tracking-tight text-xs font-light">
                      Include "Burn-In" Period
                    </div>
                    <div className="flex items-center gap-x-1">
                      <input
                        type="checkbox"
                        className="text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                        onChange={(e) => {
                          setFormInputs((prevInputs: FormInputProps) => ({
                            ...prevInputs,
                            useWarmupDate: e.target.checked, // Sets to true or false based on checkbox state
                          }));
                        }}
                        checked={formInputs.useWarmupDate}
                        name="useWarmupDate"
                      />
                    </div>
                  </div>

                  {formInputs.useWarmupDate && (
                    <>
                      <div className="tracking-tight text-xs text-center font-light">
                        "Burn-In" Start Date
                      </div>
                      <input
                        type="date"
                        className="text-xs w-full text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none"
                        value={formInputs.warmupDate}
                        onChange={handleChange}
                        name="warmupDate"
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {expanded && (
        <button
          onClick={run}
          className="gap-x-2 mt-14 flex justify-center items-center bg-sky-700 text-white justify-self-center w-full text-xl font-extrabold tracking-tight border-2 border-gray-800 rounded-lg hover:bg-sky-600 group dark:bg-blue-300 dark:text-black"
        >
          <div className="group-hover:translate-x-3 duration-700">GO</div>
          <IoMdReturnRight className="group-hover:translate-x-full group-hover:opacity-0 duration-1000" />
        </button>
      )}
    </div>
  );
}

export default InputForm;
