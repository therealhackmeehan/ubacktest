import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import { FormInputProps } from "../../../../shared/sharedTypes";
import stocks from './stocks';
import { IoMdReturnRight } from "react-icons/io";
import { CgArrowUp } from "react-icons/cg";
import { GiInvertedDice5 } from "react-icons/gi";
import { BiReset } from "react-icons/bi";
import { initFormInputs } from "../StrategyEditor";
import { addMonths } from "../StrategyEditor";
import { VscGrabber } from "react-icons/vsc";

interface InputFormSubcomponentProps {
    formInputs: FormInputProps;
    setFormInputs: (value: any) => void;
    run: (value: any) => Promise<void>;
}

const LOCAL_STORAGE_KEY = "inputFormHeight";

function InputForm({ formInputs, setFormInputs, run }: InputFormSubcomponentProps) {

    const [expanded, setExpanded] = useState<boolean>(true);

    const [displayAdvancedOptions, setDisplayAdvancedOptions] = useState<boolean>(false);
    const [matches, setMatches] = useState<{ "symbol": string; "name": string }[]>([]);
    const [useDatetimeLocal, setUseDatetimeLocal] = useState<boolean>(false);

    const formatDate = (date: string | Date, includeTime: boolean): string => {
        const d = new Date(date);
        if (!includeTime) {
            d.setHours(0, 0, 0, 0); // Reset hours when not including time
        }
        return includeTime ? d.toISOString().slice(0, 16) : d.toISOString().slice(0, 10);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        const previousUseDatetime = ["1m", "2m"].includes(formInputs.intval);

        setFormInputs((prevInputs: FormInputProps) => {
            const updatedInputs = { ...prevInputs, [name]: value };

            if (name === "intval") {
                const currUseDatetime = ["1m", "2m"].includes(value);

                if (currUseDatetime !== previousUseDatetime) {
                    // Convert all date-related fields when switching formats
                    updatedInputs.startDate = formatDate(prevInputs.startDate, currUseDatetime);
                    updatedInputs.endDate = formatDate(prevInputs.endDate, currUseDatetime);
                    updatedInputs.warmupDate = formatDate(prevInputs.warmupDate, currUseDatetime);
                    setUseDatetimeLocal(!useDatetimeLocal);
                }
            }

            return updatedInputs;
        });

        // Symbol filtering logic (remains unchanged)
        if (name === "symbol") {
            if (value.trim()) {
                const filteredMatches = stocks
                    .filter((stock) =>
                        stock["symbol"].toLowerCase().startsWith(value.toLowerCase()) ||
                        stock["name"].toLowerCase().startsWith(value.toLowerCase())
                    )
                    .slice(0, 4);
                setMatches(filteredMatches);
            } else {
                setMatches([]); // Clear matches if input is empty
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

        // Generate two random numbers between 1 and 25
        const startOffset = 1 + Math.floor(Math.random() * 25);
        const endOffset = 1 + Math.floor(Math.random() * 25);

        // Ensure start date is before end date
        const [newStartOffset, newEndOffset] = startOffset > endOffset
            ? [startOffset, endOffset]
            : [endOffset, startOffset];

        const today = new Date();
        const newStartDate = formatDate(addMonths(today, -newStartOffset), useDatetimeLocal);
        const newEndDate = formatDate(addMonths(today, -newEndOffset), useDatetimeLocal);
        const newWarmupDate = formatDate(addMonths(new Date(newStartDate), -1), useDatetimeLocal);

        setFormInputs({
            ...formInputs,
            symbol: randomStock["symbol"],
            startDate: newStartDate,
            endDate: newEndDate,
            warmupDate: newWarmupDate,
        });
    };

    const resetFormInputs = () => {
        setUseDatetimeLocal(false);
        setFormInputs(initFormInputs);
    }

    const [position, setPosition] = useState<{ y: number }>(() => {
        const savedPosition = localStorage.getItem(LOCAL_STORAGE_KEY);
        const initialPosition = savedPosition ? JSON.parse(savedPosition) : { y: 0 };

        // Ensure y is within the visible screen bounds
        const clampedY = Math.min(Math.max(initialPosition.y, 0), window.innerHeight - 100); // 50px buffer

        return { y: clampedY };
    });

    const [isDragging, setIsDragging] = useState(false);
    const offset = useRef({ y: 0 });

    useEffect(() => {
        localStorage.setItem('inputFormHeight', JSON.stringify(position))
    }, [position])

    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);

        const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        offset.current = { y: clientY - position.y };
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        const newY = clientY - offset.current.y;
        const clampedY = Math.max(0, Math.min(newY, window.innerHeight - window.innerHeight / 3));

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
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(position));
    }, [position]);

    return (
        <div
            className="z-10 flex border-2 border-black dark:border-blue-300 flex-col shadow-lg justify-between rounded-lg fixed bg-gradient-to-br from-white to-slate-100 p-4 dark:bg-gradient-to-br dark:from-boxdark dark:to-boxdark-2 dark:text-white"
            style={{ right: "3rem", top: `${position.y}px`, position: "fixed", cursor: isDragging ? "grabbing" : "default" }}
        >
            <button
                className="rounded-md -mt-3 mb-1 hover:cursor-grab active:cursor-grabbing"
                onMouseDown={handleDown}
                onTouchStart={handleDown}
            >
                <VscGrabber className="justify-self-center" />
            </button>
            <div className="space-y-3 overflow-auto px-1">
                <div className="flex justify-between items-center gap-x-4 overflow-hidden">
                    <button
                        className={`hover:text-sky-700 duration-500 hover:bg-gradient-to-br from-white to-slate-300 dark:to-black p-1 border-2 border-slate-300 rounded-md m-1 dark:text-white ${expanded ? '' : 'rotate-180'}`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <CgArrowUp />
                    </button>

                    <div className="text-lg text-slate-800 tracking-tight font-extrabold text-nowrap dark:text-white">
                        <span className="text-sm font-light text-sky-700 dark:text-blue-300">the</span> Backtest Engine
                    </div>

                </div>

                {expanded && <>

                    <div className='flex items-center justify-between gap-3'>
                        <div className="tracking-tight text-xs font-bold">
                            Symbol
                        </div>
                        <input
                            type='text'
                            maxLength={5}
                            minLength={1}
                            className='text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                            value={formInputs.symbol}
                            onChange={handleChange}
                            name="symbol"
                            autoComplete="off"
                        />
                    </div>

                    {matches.length > 0 && (
                        <ul className="text-xs z-10 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto text-black">
                            {matches.map((match) => (
                                <li
                                    key={match["symbol"]}
                                    onClick={() => handleSelect(match["symbol"])}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {match["symbol"]} - <span className="font-extralight">{match["name"]}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className='flex items-center justify-between gap-12'>
                        <div className="tracking-tight text-xs font-bold">
                            Start Date
                        </div>
                        <input
                            type={useDatetimeLocal ? 'datetime-local' : 'date'}
                            className='text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                            value={formInputs.startDate}
                            onChange={handleChange}
                            name="startDate"
                        />

                    </div>
                    <div className='flex items-center justify-between gap-12'>
                        <div className="tracking-tight text-xs font-bold">
                            End Date
                        </div>
                        <input
                            type={useDatetimeLocal ? 'datetime-local' : 'date'}
                            className='text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                            value={formInputs.endDate}
                            onChange={handleChange}
                            name="endDate"
                        />
                    </div>
                    <div className='flex items-center justify-between gap-12'>
                        <div className="tracking-tight text-xs font-bold">
                            Trading Frequency
                        </div>
                        <select
                            className='text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                            value={formInputs.intval}
                            onChange={handleChange}
                            name="intval"
                        >
                            <option value="1m">1m</option>
                            <option value="2m">2m</option>
                            <option value="5m">5m</option>
                            <option value="15m">15m</option>
                            <option value="30m">30m</option>
                            <option value="1h">1h</option>
                            <option value="90m">90m</option>
                            <option value="1d">1d</option>
                            <option value="5d">5d</option>
                            <option value="1wk">1wk</option>
                            <option value="1mo">1mo</option>
                            <option value="3mo">3mo</option>
                        </select>
                    </div>

                    <div className="flex text-xs bg-gradient-to-r from-white to-sky-700 dark:to-blue-300 rounded-md border-2 border-sky-700 dark:border-0">
                        <button className="w-full rounded-l-md p-0.5 flex gap-x-1 items-center justify-center hover:bg-slate-50 group dark:text-black"
                            onClick={randomFormInputs}>
                            random <GiInvertedDice5 className="group-hover:rotate-180 duration-500" />
                        </button>
                        <button className="w-full border-l-2 border-sky-700 dark:border-boxdark-2 rounded-r-md p-0.5 flex gap-x-1 items-center justify-center hover:bg-slate-50 group hover:text-black text-white dark:text-black"
                            onClick={resetFormInputs}>
                            reset <BiReset className="group-hover:rotate-180 duration-500" />
                        </button>
                    </div>

                    <button className="flex hover:font-bold items-center justify-self-center text-xs text-sky-700 dark:text-blue-300"
                        onClick={() => setDisplayAdvancedOptions(!displayAdvancedOptions)}>
                        advanced options
                        {displayAdvancedOptions ? <FaCaretUp size="1rem" /> : <FaCaretDown size="1rem" />}
                    </button>

                    {displayAdvancedOptions &&
                        <>
                            <div className="space-y-1 border-2 border-white bg-slate-100 rounded-md p-2 dark:bg-boxdark-2">
                                <div className='flex items-center justify-between gap-3'>
                                    <div className="tracking-tight text-xs font-light">
                                        Execute Trade @
                                    </div>
                                    <select
                                        className='text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                                        value={formInputs.timeOfDay}
                                        onChange={handleChange}
                                        name="timeOfDay"
                                    >
                                        <option value="close">close</option>
                                        <option value="open">open</option>
                                        <option value="high">high</option>
                                        <option value="low">low</option>
                                    </select>
                                </div>

                                <div className='flex items-center justify-between gap-3'>
                                    <div className="tracking-tight text-xs font-light">
                                        Cost Per Trade
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <input
                                            type='number'
                                            step={.01}
                                            min={0}
                                            max={100}
                                            className='text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                                            value={formInputs.costPerTrade}
                                            onChange={handleChange}
                                            name="costPerTrade"
                                        />
                                        <div className="font-extralight">
                                            %
                                        </div>
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
                                            className='text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
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

                                {formInputs.useWarmupDate && <>
                                    <div className="tracking-tight text-xs text-center font-light">
                                        "Burn-In" Start Date
                                    </div>
                                    <input
                                        type={useDatetimeLocal ? 'datetime-local' : 'date'}
                                        className='text-xs w-full text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                                        value={formInputs.warmupDate}
                                        onChange={handleChange}
                                        name="warmupDate"
                                    />
                                </>}
                            </div>
                        </>}
                </>}

            </div>
            {expanded &&
                <button onClick={run}
                    className="gap-x-2 mt-14 flex justify-center items-center bg-sky-700 text-white justify-self-center w-full text-xl font-extrabold tracking-tight border-2 border-gray-800 rounded-lg hover:bg-sky-600 group dark:bg-blue-300 dark:text-black"
                >
                    <div className="group-hover:translate-x-3 duration-700">
                        GO
                    </div>
                    <IoMdReturnRight className="group-hover:translate-x-full group-hover:opacity-0 duration-1000" />
                </button>
            }
        </div>

    )
}

export default InputForm;
