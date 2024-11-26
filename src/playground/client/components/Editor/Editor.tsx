import { useState } from "react"
import StrategyHeader from "../Parent/StrategyHeader"
import MonacoEditor from "./MonacoEditor";
import { ErrorModal } from "../Modals/Modals";
import Result from "../Result/Result";
import { runStrategy, charge, updateStrategy } from "wasp/client/operations";
import validateFormInputs from "../../validateFormInputs";
import validatePythonCode from "../../validatePythonCode";
import { FaCaretDown } from "react-icons/fa";

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
        <div className="col-span-5 h-full overflow-y-auto">
            {selectedStrategy && <StrategyHeader
                name={nameToDisplay}
                ID={selectedStrategy}
                result={result}
                resultOpen={resultOpen}
                setNameToDisplay={setNameToDisplay}
                setSelectedStrategy={setSelectedStrategy}
                setResultOpen={setResultOpen} />}

            {!resultOpen && <div className='z-40 flex border-y-2 border-l-2 border-black flex-col justify-between rounded-l-lg fixed right-0 h-2/3 overflow-auto bg-white my-16 p-6'>
                <div className="space-y-3">
                    <div className="text-lg text-gray-800 tracking-tight font-extrabold text-end">
                        <span className="text-sm font-light">the</span> Backtest Engine
                    </div>
                    <InputComponent type='text' text="Stock" varToSet={symbol} varToSetMethod={setSymbol} />
                    <InputComponent type='date' text="Start" varToSet={startDate} varToSetMethod={setStartDate} />
                    <InputComponent type='date' text="End" varToSet={endDate} varToSetMethod={setEndDate} />
                    <InputComponent type='text' text="Frequency" varToSet={intval} varToSetMethod={setIntval} />
                    <button className="flex hover:font-bold items-center justify-self-center text-xs">
                        advanced options
                        <FaCaretDown size="1rem" />
                    </button>
                </div>
                <button
                    type="button"
                    onClick={run}
                    disabled={!selectedStrategy}
                    className={`bg-gray-100 justify-self-center w-full text-xl font-extrabold tracking-tight border-2 border-gray-800 rounded-lg ${!selectedStrategy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-200'
                        }`}
                >
                    GO
                </button>
            </div>}


            {loading && <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-slate-800 opacity-50"></div>
                <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-600"></div>
            </div>}

            {errorModalMessage && <ErrorModal onClose={() => setErrorModalMessage('')} msg={errorModalMessage} />}

            {result && resultOpen ? (
                <Result
                    stockData={result}
                    symbol={symbol}
                    setResultOpen={setResultOpen}
                />
            ) : selectedStrategy ? (
                <MonacoEditor
                    code={codeToDisplay}
                    setCode={setCodeToDisplay}
                    ID={selectedStrategy}
                    userPrint={userStdout}
                    errPrint={userStderr}
                />
            ) : (
                <div className="p-3 m-4 tracking-tight text-gray-300 font-extrabold text-xl">
                    Create a strategy to start the editor!
                </div>
            )}




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
        <div className='flex items-center text-end grid-cols-4 gap-3'>
            <div className="tracking-tight col-span-2 font-bold">
                {text}
            </div>
            <input
                type={type}
                className='col-span-2 text-xs text-gray-600 w-full rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                placeholder={text}
                value={varToSet}
                onChange={(e) => varToSetMethod(e.currentTarget.value)}
            />
        </div>
    );
};

export default Editor;