import { useRef, useState, useEffect } from "react";
import alpacaCode from "../scripts/alpacaCode";
import { Editor } from "@monaco-editor/react";
import { miniEditorOpts } from "../StrategyPage";
import copyToClipboard from "../../result/client/components/copyToClipboard";

function StrategyCodeGen({ code }: { code: string | null }) {

    const linkRef = useRef<HTMLAnchorElement>(null);

    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [intval, setIntval] = useState<string>('5d');
    const [realMoney, setRealMoney] = useState<string>('false')
    const [symbol, setSymbol] = useState<string>('SPY');
    const [daysBackToTest, setDaysBackToTest] = useState<number>(14);

    function generateCode() {
        setGeneratedCode(code + alpacaCode);
    }

    useEffect(() => {
        if (!generatedCode) return;

        const blob = new Blob([generatedCode], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);

        if (linkRef.current) {
            linkRef.current.href = url;
            linkRef.current.download = "strategy_" + symbol + "_generatedCode.py";
        }

        return () => {
            window.URL.revokeObjectURL(url);
        };
    }, [generatedCode]);

    return (
        <div className="mt-10 p-4 rounded-lg bg-slate-100 shadow-lg border-2 border-black duration-1000">
            <div className="my-2 text-xl text-slate-800 tracking-tight font-extrabold">
                <span className="text-sky-600">Deploy this Strategy</span> with Real or Paper Money
                <span className="text-xs m-2 align-top p-1 rounded-md bg-sky-700 text-white">BETA</span>
            </div>
            <div className="rounded-md bg-slate-100 border-slate-200 border-2 p-3 lg:flex justify-between">

                <div>
                    <div className="text-sm font-extrabold tracking-tight text-sky-700 text-start">Stock To Trade</div>
                    <input
                        className="rounded-lg w-full text-xs shadow-lg"
                        type='text'
                        value={symbol}
                        onChange={(e) => setSymbol(e.currentTarget.value)}
                    />
                </div>

                <div className="md:flex gap-x-4">
                    {/* <div>
                        <div className="text-sm font-bold text-center">Trading Frequency</div>
                        <select
                            className="rounded-lg w-full text-xs"
                            value={intval}
                            onChange={(e) => setIntval(e.currentTarget.value)}
                        >
                            <option value="1d">1d</option>
                            <option value="5d">5d</option>
                            <option value="1mo">1mo</option>
                            <option value="3mo">3mo</option>
                            <option value="6mo">6mo</option>
                            <option value="1y">1y</option>
                            <option value="2y">2y</option>
                            <option value="5y">5y</option>
                            <option value="ytd">ytd</option>
                            <option value="max">max</option>
                        </select>
                    </div> */}

                    <div>
                        <div className="text-sm font-bold text-center">Approx. Lookback Period</div>
                        <input
                            className="rounded-lg w-full text-xs shadow-lg"
                            type='number'
                            value={daysBackToTest}
                            onChange={(e) => setDaysBackToTest(e.currentTarget.valueAsNumber)}
                        />
                    </div>

                    <div>
                        <div className="text-sm font-bold text-center">Use Real Money</div>
                        <select
                            className="rounded-lg w-full text-xs shadow-lg"
                            value={realMoney}
                            onChange={(e) => setRealMoney(e.currentTarget.value)}
                        >
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    </div>
                </div>


                <button className="shadow-lg duration-500 mt-2 lg:m-0 rounded-md p-2 bg-sky-700 hover:bg-sky-600 text-white"
                    onClick={generateCode}>
                    Generate Code
                </button>
            </div>

            <div className="mt-2 border-2 border-slate-800">
                <div className="flex text-xs justify-start bg-slate-600">
                    <a
                        type='button'
                        ref={linkRef}
                        className="flex px-3 py-1 items-center text-center tracking-tight text-white hover:bg-slate-800 hover:font-bold duration-700"
                    > download
                    </a>
                    <button
                        type='button'
                        onClick={() => copyToClipboard(generatedCode)} // Keep the existing button functionality
                        className="flex px-3 py-1 items-center text-center tracking-tight text-white hover:bg-slate-800 hover:font-bold duration-700"
                    > copy
                    </button>
                </div>
                <Editor
                    className="invert hue-rotate-180 hover:hue-rotate-15"
                    options={miniEditorOpts}
                    height={generatedCode ? "40vh" : "12vh"}
                    defaultLanguage='python'
                    theme="vs-dark"
                    value={generatedCode || '# Generated code will appear here (:'}
                    loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)}
                />

            </div>
        </div>
    )
}

export default StrategyCodeGen;