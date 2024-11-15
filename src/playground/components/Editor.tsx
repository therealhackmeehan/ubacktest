import { useState } from "react"
import StrategyHeader from "./StrategyHeader"
import MonacoEditor from "./MonacoEditor";
import Pipeline from "../Pipeline/Pipeline";
import { ErrorModal } from "./modals/Modals";
import ChartAndStats from "./ChartAndStats";

interface EditorProps {
    nameToDisplay: string;
    codeToDisplay: string;
    selectedStrategy: string;
    setNameToDisplay: (value: string) => void;
    setCodeToDisplay: (value: string) => void;
    setSelectedStrategy: (value: string) => void;
}

function Editor({ nameToDisplay, codeToDisplay, selectedStrategy, setNameToDisplay, setCodeToDisplay, setSelectedStrategy }: EditorProps) {

    const [startDate, setStartDate] = useState<string>('2020-02-02');
    const [endDate, setEndDate] = useState<string>('2020-05-02');
    const [symbol, setSymbol] = useState<string>('SPY');
    const [intval, setIntval] = useState<string>('1d');

    const [errorModalMessage, setErrorModalMessage] = useState<string>('');

    const [userStdout, setUserStdout] = useState<string>('');
    const [userStderr, setUserStdErr] = useState<string>('');
    const [result, setResult] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    async function run() {

        setUserStdErr('');
        setUserStdout('');
        setResult(null);
        setErrorModalMessage('');
        setLoading(true);

        try {
            const r = await Pipeline({ symbol, startDate, endDate, intval, code: codeToDisplay })

            if (r.userPrint) {
                setUserStdout(r.userPrint)
            }

            if (r.errPrint) {
                setUserStdErr(r.errPrint)
            } else {
                setResult(r.data);
            }

        } catch (error) {
            setErrorModalMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="col-span-5">
            <StrategyHeader name={nameToDisplay} ID={selectedStrategy} setNameToDisplay={setNameToDisplay} setSelectedStrategy={setSelectedStrategy} />

            {loading &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
                    <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-purple-600"></div>
                </div>

            }

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

            {errorModalMessage &&
                <ErrorModal onClose={() => setErrorModalMessage('')} msg={errorModalMessage} />
            }


            {result && <ChartAndStats stockData={result} />}

            <MonacoEditor code={codeToDisplay} setCode={setCodeToDisplay} ID={selectedStrategy} userPrint={userStdout} errPrint={userStderr} />

        </div>
    )
}

interface InputComponentProps {
    text: string;
    varToSet: string;
    varToSetMethod: (value: string) => void;
}

function InputComponent({ text, varToSet, varToSetMethod }: InputComponentProps) {

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