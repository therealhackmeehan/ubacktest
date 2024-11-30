import { useState } from "react";
import Editor from "./Editor";
import Result from "../Result/Result";

interface DashboardProps {
    selectedStrategy: string;
    codeToDisplay: string;
    setCodeToDisplay: (value: string) => void;
}

export interface FormInputProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
    timeOfDay: string;
    warmup: number;
}

function Dashboard({ selectedStrategy, codeToDisplay, setCodeToDisplay }: DashboardProps) {

    const [resultOpen, setResultOpen] = useState<boolean>(false);
    const [result, setResult] = useState<any>();
    const [strategyResultIsConnectedTo, setStrategyResultIsConnectedTo] = useState<string>('');

    const [formInputs, setFormInputs] = useState<FormInputProps>({
        symbol: 'SPY',
        startDate: '2020-02-02',
        endDate: '2020-05-02',
        intval: '1d',
        timeOfDay: 'close',
        warmup: 0
    });

    const [userStdout, setUserStdout] = useState<string>('');
    const [userStderr, setUserStderr] = useState<string>('');

    return (
        <>
            <button
                className={`w-full duration-700 ease-in-out py-1 px-12 
                            font-extrabold text-sm hover:scale-110 
                            tracking-tight bg-slate-200 text-slate-800
                            ${resultOpen && 'bg-slate-700 text-white'}`}

                onClick={() => setResultOpen(!resultOpen)}
            >
                Toggle To {resultOpen ? 'Editor' : 'Result'}
            </button>

            {resultOpen ? (
                <Result
                    stockData={result}
                    formInputs={formInputs}
                    strategyResultIsConnectedTo={strategyResultIsConnectedTo}
                    selectedStrategy={selectedStrategy}
                />
            ) : (
                <Editor
                    codeToDisplay={codeToDisplay}
                    selectedStrategy={selectedStrategy}
                    setCodeToDisplay={setCodeToDisplay}
                    setResult={setResult}
                    setResultOpen={setResultOpen}
                    formInputs={formInputs}
                    setFormInputs={setFormInputs}
                    setStrategyResultIsConnectedTo={setStrategyResultIsConnectedTo}
                    userStdout={userStdout}
                    userStderr={userStderr}
                    setUserStdout={setUserStdout}
                    setUserStderr={setUserStderr}
                />
            )}
        </>
    )
}

export default Dashboard;