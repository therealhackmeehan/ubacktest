import { useState } from "react";
import Editor from "./Editor";
import Result from "../Result/Result";

interface DashboardProps {
    selectedStrategy: string;
    codeToDisplay: string;
    setCodeToDisplay: (value: string) => void;
}

function Dashboard({ selectedStrategy, codeToDisplay, setCodeToDisplay }: DashboardProps) {

    const [resultOpen, setResultOpen] = useState<boolean>(false);
    const [result, setResult] = useState<any>();

    return (
        <>
            <button
                className={`w-full duration-700 ease-in-out my-1 py-1 px-12 
                            font-extrabold text-sm hover:scale-110 
                            tracking-tight bg-slate-200 text-slate-800
                            ${resultOpen && 'bg-slate-700 text-white'}`}

                onClick={() => setResultOpen(!resultOpen)}
            >
                Toggle To {resultOpen ? 'Editor' : 'Result'}
            </button>

            {resultOpen ? <Result stockData={result} symbol={'AAPL'} /> :
                <Editor
                    codeToDisplay={codeToDisplay}
                    selectedStrategy={selectedStrategy}
                    setCodeToDisplay={setCodeToDisplay}
                    setResult={setResult}
                    setResultOpen={setResultOpen} />}
        </>
    )
}

export default Dashboard;