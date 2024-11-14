import { useState } from "react"
import StrategyHeader from "./StrategyHeader"
import MonacoEditor from "./MonacoEditor";
import Pipeline from "./Pipeline/Pipeline";

interface EditorProps {
    nameToDisplay: string;
    codeToDisplay: string;
    selectedStrategy: string;
    setNameToDisplay: (value: string) => void;
    setCodeToDisplay: (value: string) => void;
    setSelectedStrategy: (value: string) => void;
}

function Editor({nameToDisplay, codeToDisplay, selectedStrategy, setNameToDisplay, setCodeToDisplay, setSelectedStrategy}: EditorProps) {

    const [startDate, setStartDate] = useState<string>('2020-02-02');
    const [endDate, setEndDate] = useState<string>('2020-05-02');
    const [symbol, setSymbol] = useState<string>('SPY');
    const [intval, setIntval] = useState<string>('1d');

    function run() {

        try {
            Pipeline({symbol, startDate, endDate, intval, codeToDisplay})
        } catch {
            console.log("error")
        }
    }

    return (
        <div className="col-span-5">
            <StrategyHeader name={nameToDisplay} ID={selectedStrategy} setNameToDisplay={setNameToDisplay} setSelectedStrategy={setSelectedStrategy}/>

            <div className='flex bg-gray-100 rounded-md gap-y-2 justify-between dark:text-purple-900 gap-3 px-12 m-4 p-2 mx-2 '>
                <InputComponent text="Stock" varToSet={symbol} varToSetMethod={setSymbol} />
                <InputComponent text="Start" varToSet={startDate} varToSetMethod={setStartDate} />
                <InputComponent text="End" varToSet={endDate} varToSetMethod={setEndDate} />
                <InputComponent text="Frequency" varToSet={intval} varToSetMethod={setIntval} />
                <button
                    type='button'
                    onClick={run}
                    className='min-w-[7rem] text-2xl border-black border-2 tracking-tight font-extrabold text-purple-800 shadow-md ring-1 ring-inset ring-slate-200 p-1 rounded-md hover:bg-green-200 duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-none'
                >
                    GO
                </button>
            </div>

            <MonacoEditor code={codeToDisplay} setCode={setCodeToDisplay} ID={selectedStrategy} />

        </div>
    )
}

interface InputComponentProps {
    text: string;
    varToSet: string;
    varToSetMethod: (value: string) => void;
}

function InputComponent({text, varToSet, varToSetMethod}: InputComponentProps) {

    return (
        <div className='flex items-center justify-between gap-3'>
            <div className="tracking-tight text-xl font-bold">
                {text}
            </div>
            <input
                type='text'
                className='text-sm text-gray-600 w-full rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                placeholder={text}
                value={varToSet}
                onChange={(e) => varToSetMethod(e.currentTarget.value)}
            />
        </div>
    );
};

export default Editor;