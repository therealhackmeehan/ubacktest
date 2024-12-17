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
    costPerTrade: number;
}

export interface stdProps {
    out: string;
    err: string;
}

function Dashboard({ selectedStrategy, codeToDisplay, setCodeToDisplay }: DashboardProps) {

    const [resultOpen, setResultOpen] = useState<boolean>(false);
    const [result, setResult] = useState<any>();
    const [strategyResultIsConnectedTo, setStrategyResultIsConnectedTo] = useState<string>('');

    const [formInputs, setFormInputs] = useState<FormInputProps>({
        symbol: 'SPY',
        startDate: '2020-02-02',
        endDate: '2020-05-02',
        intval: '5d',
        timeOfDay: 'close',
        costPerTrade: 0,
    });

    const [std, setStd] = useState<stdProps>({
        out: '',
        err: '',
    });

    return (
        <>
            <button
                className={`w-full duration-700 ease-in-out py-1 px-12 
                            hover:font-extrabold
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
                    std={std}
                    setStd={setStd}
                />
            )}
        </>
    )
}

export default Dashboard;