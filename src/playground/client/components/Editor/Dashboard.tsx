import { useState } from "react";
import Editor from "./Editor";
import Result from "../Result/Result";
import { FormInputProps, StrategyResultProps } from "../../../../shared/sharedTypes";

interface DashboardProps {
    selectedStrategy: string;
    codeToDisplay: string;
    setCodeToDisplay: (value: string) => void;
}

export interface stdProps {
    out: string;
    err: string;
}

function Dashboard({ selectedStrategy, codeToDisplay, setCodeToDisplay }: DashboardProps) {

    const [resultOpen, setResultOpen] = useState<boolean>(false);
    const [strategyResult, setStrategyResult] = useState<StrategyResultProps | null>(null);
    const [strategyResultIsConnectedTo, setStrategyResultIsConnectedTo] = useState<string>('');

    const [formInputs, setFormInputs] = useState<FormInputProps>({
        symbol: 'aapl',
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
                            tracking-tight 
                            ${resultOpen ?
                        'bg-slate-700 text-white' :
                        'bg-slate-200 text-sky-800'}`}

                onClick={() => setResultOpen(!resultOpen)}
            >
                Toggle To {resultOpen ? 'Editor' : 'Result'}
            </button>

            {resultOpen ? (
                <Result
                    strategyResult={strategyResult}
                    formInputs={formInputs}
                    strategyResultIsConnectedTo={strategyResultIsConnectedTo}
                    selectedStrategy={selectedStrategy}
                />
            ) : (
                <Editor
                    codeToDisplay={codeToDisplay}
                    selectedStrategy={selectedStrategy}
                    setCodeToDisplay={setCodeToDisplay}
                    setStrategyResult={setStrategyResult}
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