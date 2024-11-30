import { useState } from "react"
import MonacoEditor from "./MonacoEditor";
import { ErrorModal } from "../Modals/Modals";
import DebugConsole from "./DebugConsole";
import { runStrategy, charge, updateStrategy } from "wasp/client/operations";
import validateFormInputs from "../../scripts/validateFormInputs";
import validatePythonCode from "../../scripts/validatePythonCode";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { type FormInputProps } from "./Dashboard";

interface EditorProps {
    codeToDisplay: string;
    selectedStrategy: string;
    formInputs: FormInputProps;
    setCodeToDisplay: (value: string) => void;
    setResult: (value: any) => void;
    setResultOpen: (value: boolean) => void;
    setFormInputs: (value: any) => void;
    setStrategyResultIsConnectedTo: (value: string) => void;
    userStdout: string;
    userStderr: string;
    setUserStdout: (value: string) => void;
    setUserStderr: (value: string) => void;
}

function Editor({ codeToDisplay, selectedStrategy, formInputs, setCodeToDisplay, setResult, setResultOpen, setFormInputs, setStrategyResultIsConnectedTo, userStdout, userStderr, setUserStdout, setUserStderr }: EditorProps) {

    const [displayAdvancedOptions, setDisplayAdvancedOptions] = useState<boolean>(false);
    const [errorModalMessage, setErrorModalMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function run() {
        setInitialState();

        try {
            await handlePreRunValidations();

            const { data, debugOutput, stderr } = await runStrategy({ formInputs: formInputs, code: codeToDisplay });
            handleDebugOutput(debugOutput, stderr);

            const existsData = data?.portfolio && data?.signal && data?.returns;
            if (existsData) {
                setResult(data);
                setResultOpen(true);
                setStrategyResultIsConnectedTo(selectedStrategy);
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
        setUserStderr('');
        setUserStdout('');
        setResult(null);
        setErrorModalMessage('');
        setLoading(true);
    }

    async function handlePreRunValidations() {
        await updateStrategy({ id: selectedStrategy, code: codeToDisplay });
        validateFormInputs({ formInputs });
        validatePythonCode({ code: codeToDisplay });
    }

    function handleDebugOutput(debugOutput: string, stderr: string) {
        if (debugOutput) setUserStdout(debugOutput);
        if (stderr) setUserStderr(stderr);
    }

    return (
        <div className="h-full">

            <div className='z-40 flex border-2 border-black flex-col shadow-lg justify-between rounded-lg fixed right-0 h-2/3 bg-white my-16 mr-12 p-6'>
                <div className="space-y-3 overflow-auto">
                    <div className="text-lg text-gray-800 tracking-tight font-extrabold text-end">
                        <span className="text-sm font-light">the</span> Backtest Engine
                    </div>
                    <InputComponent
                        type="text"
                        text="Symbol"
                        field="symbol"
                        value={formInputs.symbol}
                        setFormInputs={setFormInputs}
                    />
                    <InputComponent
                        type="date"
                        text="Start Date"
                        field="startDate"
                        value={formInputs.startDate}
                        setFormInputs={setFormInputs}
                    />
                    <InputComponent
                        type="date"
                        text="End Date"
                        field="endDate"
                        value={formInputs.endDate}
                        setFormInputs={setFormInputs}
                    />
                    <InputComponent
                        type="text"
                        text="Trading Frequency"
                        field="intval"
                        value={formInputs.intval}
                        setFormInputs={setFormInputs}
                    />
                    <button className="flex hover:font-bold items-center justify-self-center text-xs"
                        onClick={() => setDisplayAdvancedOptions(!displayAdvancedOptions)}>
                        advanced options
                        {displayAdvancedOptions ? <FaCaretUp size="1rem" /> : <FaCaretDown size="1rem" />}
                    </button>

                    {displayAdvancedOptions &&
                        <div className="scale-75 hue-rotate-90 bg-slate-100 rounded-lg p-4">
                            <InputComponent
                                type="text"
                                text="Execution Time @ Period"
                                field="timeOfDay"
                                value={formInputs.timeOfDay}
                                setFormInputs={setFormInputs}
                            />
                            <InputComponent
                                type="text"
                                text="Builtin Warmup Period"
                                field="warmup"
                                value={formInputs.warmup}
                                setFormInputs={setFormInputs}
                            />
                            <InputComponent
                                type="text"
                                text="Builtin Warmup Period"
                                field="warmup"
                                value={formInputs.warmup}
                                setFormInputs={setFormInputs}
                            />
                        </div>
                    }
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

        </div>
    )
}

interface InputComponentProps {
    text: string;
    field: keyof FormInputProps;
    value: string | number;
    type: string;
    setFormInputs: (React.Dispatch<React.SetStateAction<FormInputProps>>);
}

function InputComponent({ text, field, value, type, setFormInputs }: InputComponentProps) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormInputs((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className='flex text-end grid-cols-4 items-center gap-3'>
            <div className="tracking-tight col-span-4 text-sm text-left font-bold">
                {text}
            </div>
            <input
                type={type}
                className='text-xs col-span-2 text-gray-600 rounded-md border border-gray-200 shadow-md focus:outline-none focus:border-transparent focus:shadow-none duration-200 ease-in-out hover:shadow-none'
                placeholder={text}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}


export default Editor;