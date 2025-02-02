import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import React, { useState, useCallback } from "react";
import { FormInputProps } from "../../../../shared/sharedTypes";
import stocks from './stocks';
import { IoMdReturnRight } from "react-icons/io";
import { CgArrowUp } from "react-icons/cg";

interface InputFormSubcomponentProps {
    formInputs: FormInputProps;
    setFormInputs: (value: any) => void;
    run: (value: any) => Promise<void>;
}

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
                        stock["name"].toLowerCase().includes(value.toLowerCase())
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

    // const [position, setPosition] = useState({ x: 0, y: 0 });
    // const [isDragging, setIsDragging] = useState(false);

    // const startDrag = (e) => {
    //     if (!expanded) {
    //         setIsDragging(true);
    //     }
    // };

    // const stopDrag = () => {
    //     setIsDragging(false);
    // };

    // const onDrag = useCallback(
    //     (e) => {
    //         if (!isDragging || expanded) return;

    //         const newX = e.clientX - e.target.offsetWidth / 2;
    //         const newY = e.clientY - e.target.offsetHeight / 2;
    //         setPosition({ x: newX, y: newY });
    //     },
    //     [isDragging, expanded]
    // );

    return (
        <div
            className="z-10 flex border-2 border-black flex-col shadow-lg justify-between right-0 rounded-lg fixed bg-gradient-to-br from-white to-slate-100 my-16 mr-12 p-4"
            // style={{
            //     top: expanded ? '300px' : position.y,  // Change '50px' to your default position when expanded
            //     left: expanded ? '600px' : position.x,  // Same for the left value
            //     cursor: isDragging && !expanded ? 'grabbing' : 'grab',
            // }}
            // onMouseDown={startDrag}
            // onMouseUp={stopDrag}
            // onMouseMove={onDrag}
        >
            <div className="space-y-3 overflow-auto px-1">
                <div className="flex justify-between items-center gap-x-4 overflow-hidden">
                    <button
                        className={`hover:text-sky-700 duration-500 hover:bg-gradient-to-br from-white to-slate-300 p-1 border-2 border-slate-300 rounded-md m-1 ${expanded ? '' : 'rotate-180'}`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <CgArrowUp />
                    </button>

                    <div className="text-lg text-slate-800 tracking-tight font-extrabold text-nowrap">
                        <span className="text-sm font-light text-sky-700">the</span> Backtest Engine
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
                        <ul className="text-xs z-10 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
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

                    <div className='flex items-center justify-between gap-3'>
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
                    <div className='flex items-center justify-between gap-3'>
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
                    <div className='flex items-center justify-between gap-3'>
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
                    <button className="flex hover:font-bold items-center justify-self-center text-xs text-sky-700"
                        onClick={() => setDisplayAdvancedOptions(!displayAdvancedOptions)}>
                        advanced options
                        {displayAdvancedOptions ? <FaCaretUp size="1rem" /> : <FaCaretDown size="1rem" />}
                    </button>

                    {displayAdvancedOptions &&
                        <>
                            <div className="space-y-1 border-2 border-slate-800 bg-slate-100 rounded-md p-2">
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
                            <div className="space-y-1 border-2 border-slate-800 bg-slate-200 rounded-md p-2">
                                <div className="flex py-2 items-center justify-between gap-3">
                                    <div className="tracking-tight text-xs font-light">
                                        Include "Warm-Up" Period
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
                                        "Warm-Up" Start Date
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
                    className="gap-x-2 mt-12 flex justify-center items-center bg-sky-700 text-white justify-self-center w-full text-xl font-extrabold tracking-tight border-2 border-gray-800 rounded-lg hover:bg-sky-600"
                >
                    GO
                    <IoMdReturnRight />
                </button>
            }
        </div>

    )
}

export default InputForm;
