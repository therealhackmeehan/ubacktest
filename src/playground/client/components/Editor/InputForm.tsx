import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useState } from "react";
import { FormInputProps } from "./Dashboard";

interface InputFormSubcomponentProps {
    formInputs: FormInputProps;
    setFormInputs: (value: any) => void;
    run: (value: any) => Promise<void>;
}

export default function InputForm({ formInputs, setFormInputs, run }: InputFormSubcomponentProps) {

    const [displayAdvancedOptions, setDisplayAdvancedOptions] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormInputs((prevInputs: FormInputProps) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    const inputFormCss = 'text-xs text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none';

    return (
        <div className='z-10 flex border-2 border-black flex-col shadow-lg justify-between rounded-lg fixed right-0 h-2/3 w-1/5 bg-white my-16 mr-12 p-6'>
            <div className="space-y-3 overflow-auto px-1">
                <div className="text-lg text-slate-800 tracking-tight font-extrabold text-end">
                    <span className="text-sm font-light text-sky-600">the</span> Backtest Engine
                </div>
                <div className='flex items-center justify-between gap-3'>
                    <div className="tracking-tight text-xs font-bold">
                        Symbol
                    </div>
                    <input
                        type='text'
                        maxLength={5}
                        minLength={1}
                        className={inputFormCss}
                        value={formInputs.symbol}
                        onChange={handleChange}
                        name="symbol"
                    />
                </div>
                <div className='flex items-center justify-between gap-3'>
                    <div className="tracking-tight text-xs font-bold">
                        Start Date
                    </div>
                    <input
                        type='date'
                        className={inputFormCss}
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
                        type='date'
                        className={inputFormCss}
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
                        className={inputFormCss}
                        value={formInputs.intval}
                        onChange={handleChange}
                        name="intval"
                    >
                        <option value="1d">1d</option>
                        <option value="5d">5d</option>
                        <option value="1mo">1mo</option>
                        <option value="3mo">3mo</option>
                        <option value="6mo">6mo</option>
                        <option value="1y">1y</option>
                        <option value="2y">2y</option>
                        <option value="5y">5y</option>
                        <option value="ytd">ytd</option>
                        <option value="max">max</option>
                    </select>
                </div>
                <button className="flex hover:font-bold items-center justify-self-center text-xs text-sky-600"
                    onClick={() => setDisplayAdvancedOptions(!displayAdvancedOptions)}>
                    advanced options
                    {displayAdvancedOptions ? <FaCaretUp size="1rem" /> : <FaCaretDown size="1rem" />}
                </button>

                {displayAdvancedOptions &&
                    <div className="space-y-1 border-2 border-slate-300 bg-sky-50 rounded-md p-2">
                        <div className='flex items-center justify-between gap-3'>
                            <div className="tracking-tight text-xs font-bold">
                                Execute Trade @
                            </div>
                            <select
                                className={inputFormCss}
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
                            <div className="tracking-tight text-xs font-bold">
                                Cost Per Trade
                            </div>
                            <div className="flex items-center gap-x-1">
                                <input
                                    type='number'
                                    step={1}
                                    min={0}
                                    max={100}
                                    className={inputFormCss}
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
                }
            </div>
            <button onClick={run}
                className="bg-gray-100 justify-self-center w-full text-xl font-extrabold tracking-tight border-2 border-gray-800 rounded-lg hover:bg-sky-100"
            >
                GO
            </button>
        </div>

    )
}
