import { useState } from "react"
import StrategyHeader from "./StrategyHeader"
import MonacoEditor from "./MonacoEditor";
import { ErrorModal } from "./modals/Modals";
import ChartAndStats from "./ChartAndStats";
import { runStrategy, charge, updateStrategy } from "wasp/client/operations";
import validateFormInputs from "../validateFormInputs";
import validatePythonCode from "../validatePythonCode";

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
    const [endDate, setEndDate] = useState<string>('2020-03-02');
    const [symbol, setSymbol] = useState<string>('SPY');
    const [intval, setIntval] = useState<string>('1d');

    // useState for time at which to trade (open, close, etc)

    const [errorModalMessage, setErrorModalMessage] = useState<string>('');

    const [userStdout, setUserStdout] = useState<string>('');
    const [userStderr, setUserStdErr] = useState<string>('');

    const [result, setResult] = useState<any>(null);
    const [resultOpen, setResultOpen] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    async function run() {
        setInitialState();

        try {
            await handlePreRunValidations();

            const { data, debugOutput, stderr } = await executeStrategy();
            handleDebugOutput(debugOutput, stderr);

            const existsData = data?.portfolio && data?.signal && data?.returns;
            if (existsData) {
                setResult(data);
                setResultOpen(true);
                charge(); // Deduct a credit
            } else if (!stderr) {
                throw new Error('Something went wrong. No stderr was reported but also no data was returned.');
            }

        } catch (error: any) {
            setErrorModalMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Helper Functions
    function setInitialState() {
        setUserStdErr('');
        setUserStdout('');
        setResult(null);
        setErrorModalMessage('');
        setLoading(true);
    }

    async function handlePreRunValidations() {
        await updateStrategy({ id: selectedStrategy, code: codeToDisplay });
        validateFormInputs({ symbol, startDate, endDate, intval });
        validatePythonCode({ code: codeToDisplay });
    }

    async function executeStrategy() {
        return await runStrategy({ symbol, startDate, endDate, intval, code: codeToDisplay });
    }

    function handleDebugOutput(debugOutput: string, stderr: string) {
        if (debugOutput) setUserStdout(debugOutput);
        if (stderr) setUserStdErr(stderr);
    }

    return (
        <div className="col-span-5">
            {selectedStrategy && <StrategyHeader name={nameToDisplay} ID={selectedStrategy} setNameToDisplay={setNameToDisplay} setSelectedStrategy={setSelectedStrategy} />}

            {loading &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
                    <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-purple-600"></div>
                </div>
            }

            <div className='flex bg-gray-100 rounded-md gap-y-2 justify-between dark:text-purple-900 gap-3 px-12 m-4 p-2 mx-2 '>
                <InputComponent type='text' text="Stock" varToSet={symbol} varToSetMethod={setSymbol} />
                <InputComponent type='date' text="Start" varToSet={startDate} varToSetMethod={setStartDate} />
                <InputComponent type='date' text="End" varToSet={endDate} varToSetMethod={setEndDate} />
                <InputComponent type='text' text="Frequency" varToSet={intval} varToSetMethod={setIntval} />
                <button
                    type="button"
                    onClick={run}
                    disabled={!selectedStrategy}
                    className={`min-w-[7rem] text-2xl border-black border-2 tracking-tight font-extrabold text-purple-800 shadow-md ring-1 ring-inset ring-slate-200 p-1 rounded-md duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-none ${!selectedStrategy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-200'
                        }`}
                >
                    GO
                </button>

            </div>

            {
                errorModalMessage &&
                <ErrorModal onClose={() => setErrorModalMessage('')} msg={errorModalMessage} />
            }

            {result && resultOpen && <ChartAndStats stockData={result} symbol={symbol} setResultOpen={setResultOpen} />}

            {
                result && !resultOpen &&
                <button className="p-2 my-2 tracking-tight font-bold border-2 border-purple-800 rounded-lg hover:bg-purple-100 w-full" onClick={() => setResultOpen(true)}>
                    Click to Open Result of Most Recent Backtest
                </button>
            }

            {selectedStrategy ?
                <MonacoEditor code={codeToDisplay} setCode={setCodeToDisplay} ID={selectedStrategy} userPrint={userStdout} errPrint={userStderr} />
                : <div className="p-3 m-4 text-xl">Create a strategy to activate the editor.</div>}

        </div >
    )
}

interface InputComponentProps {
    text: string;
    varToSet: string;
    varToSetMethod: (value: string) => void;
    type: string;
}

function InputComponent({ text, varToSet, varToSetMethod, type }: InputComponentProps) {

    return (
        <div className='flex items-center justify-between gap-3'>
            <div className="tracking-tight text-xl font-bold">
                {text}
            </div>
            <input
                type={type}
                className='text-sm text-gray-600 w-full rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                placeholder={text}
                value={varToSet}
                onChange={(e) => varToSetMethod(e.currentTarget.value)}
            />
        </div>
    );
};

export default Editor;