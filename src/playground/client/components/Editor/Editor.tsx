import { useState } from "react"
import MonacoEditor from "./MonacoEditor";
import { ErrorModal } from "../Modals/Modals";
import DebugConsole from "./DebugConsole";
import { runStrategy, charge, updateStrategy } from "wasp/client/operations";
import validateFormInputs from "../../scripts/validateFormInputs";
import validatePythonCode from "../../scripts/validatePythonCode";
import { FaCaretDown } from "react-icons/fa";

interface EditorProps {
    codeToDisplay: string;
    selectedStrategy: string;
    setCodeToDisplay: (value: string) => void;
    setResult: (value: any) => void;
    setResultOpen: (value: boolean) => void;
}

function Editor({ codeToDisplay, selectedStrategy, setCodeToDisplay, setResult, setResultOpen}: EditorProps) {

    const [startDate, setStartDate] = useState<string>('2020-02-02');
    const [endDate, setEndDate] = useState<string>('2020-03-02');
    const [symbol, setSymbol] = useState<string>('SPY');
    const [intval, setIntval] = useState<string>('1d');

    const [errorModalMessage, setErrorModalMessage] = useState<string>('');

    const [userStdout, setUserStdout] = useState<string>('');
    const [userStderr, setUserStdErr] = useState<string>('');

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
        <div className="h-full overflow-y-auto">

            <div className='z-40 flex border-2 border-black flex-col shadow-lg justify-between rounded-lg fixed right-0 h-2/3 overflow-auto bg-white my-16 mr-12 p-6'>
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
                <button onClick={run}
                    className="bg-gray-100 justify-self-center w-full text-xl font-extrabold tracking-tight border-2 border-gray-800 rounded-lg hover:bg-green-200"
                >
                    GO
                </button>
            </div>

            {loading &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-slate-800 opacity-50"></div>
                    <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-600"></div>
                </div>}

            {errorModalMessage && <ErrorModal onClose={() => setErrorModalMessage('')} msg={errorModalMessage} />}

            <MonacoEditor
                code={codeToDisplay}
                setCode={setCodeToDisplay}
                ID={selectedStrategy}
            />

            <DebugConsole userStdout={userStdout} userStderr={userStderr} />

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