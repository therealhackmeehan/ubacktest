import { useRef, useState, useEffect } from "react";
import { alpacaCode } from "../scripts/alpacaCode";
import { Editor } from "@monaco-editor/react";
import { miniEditorOpts } from "../StrategyPage";
import copyToClipboard from "../../result/client/components/copyToClipboard";

function StrategyCodeGen({ code }: { code: string | null }) {

    const linkRef = useRef<HTMLAnchorElement>(null);

    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [intval, setIntval] = useState<{ amount: string; timeframe: string }>({
        amount: "1",
        timeframe: "TimeFrameUnit.Day",
    });

    const [symbol, setSymbol] = useState<string>('SPY');
    const [daysBackToTest, setDaysBackToTest] = useState<number>(100);

    // const monacoRef = useRef<any>(null);

    // function handleEditorDidMount(editor, monaco) {
    //     monacoRef.current = monaco;
    // }

    function generateCode() {
        if (!code) {
            setGeneratedCode('Your strategy is empty.')
            return;
        };

        const newCode = alpacaCode(code, symbol, daysBackToTest, intval.amount, intval.timeframe);
        setGeneratedCode(newCode);

        // if (monacoRef.current) {
        //     setTimeout(() => {
        //         if (monacoRef.current) {
        //             monacoRef.current.setValue(newCode); // Update editor content
        //             monacoRef.current.getAction("editor.foldAll")?.run(); // Collapse all code
        //         }
        //     }, 1000);
        // }
    }

    function clearCode() {
        setGeneratedCode(null);
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
        <div className="mt-10 p-4 rounded-lg bg-white border-2 border-sky-700 dark:border-0 dark:bg-boxdark">
            <div className="my-2 text-xl text-slate-800 tracking-tight font-extrabold dark:text-white">
                <span className="text-sky-600 dark:text-blue-300">Deploy this Strategy</span> with Real or Paper Money
                <span className="text-xs m-2 md:align-top p-1 rounded-md bg-sky-700 text-white dark:bg-blue-300 dark:text-black">BETA</span>
            </div>
            <div className="rounded-md bg-slate-100 border-slate-200 border-2 p-3 lg:flex justify-between dark:bg-boxdark-2 dark:border-0">

                <div>
                    <div className="text-sm font-extrabold tracking-tight text-sky-700 text-start dark:text-white">Stock To Trade</div>
                    <input
                        className="rounded-lg w-full text-xs shadow-lg"
                        type='text'
                        value={symbol}
                        onChange={(e) => setSymbol(e.currentTarget.value)}
                    />
                </div>

                <div className="md:flex gap-x-4">
                    <div>
                        <div className="text-sm font-bold text-center dark:text-white ">Trading Frequency</div>
                        <select
                            className="rounded-lg w-full text-xs"
                            value={`${intval.amount}_${intval.timeframe}`}
                            onChange={(e) => {
                                const [amount, timeframe] = e.currentTarget.value.split("_");
                                setIntval({ amount, timeframe });
                            }}
                        >
                            <option value="1_TimeFrameUnit.Minute">1 min</option>
                            <option value="3_TimeFrameUnit.Minute">3 min</option>
                            <option value="5_TimeFrameUnit.Minute">5 min</option>
                            <option value="15_TimeFrameUnit.Minute">15 min</option>
                            <option value="30_TimeFrameUnit.Minute">30 min</option>
                            <option value="1_TimeFrameUnit.Hour">1 hour</option>
                            <option value="3_TimeFrameUnit.Hour">3 hours</option>
                            <option value="12_TimeFrameUnit.Hour">12 hours</option>
                            <option value="1_TimeFrameUnit.Day">1 day</option>
                            <option value="1_TimeFrameUnit.Week">1 week</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-sm font-bold text-center dark:text-white">Approx. Lookback Period</div>
                        <input
                            className="rounded-lg w-full text-xs shadow-lg"
                            type='number'
                            value={daysBackToTest}
                            onChange={(e) => setDaysBackToTest(e.currentTarget.valueAsNumber)}
                        />
                    </div>
                </div>

                <div className="mt-2 lg:m-0 space-x-4 items-center align-bottom">
                    <button className="shadow-lg duration-500 rounded-md p-2 bg-sky-500 hover:bg-sky-600 text-white dark:text-blue-300 dark:bg-boxdark dark:border-2 dark:border-white"
                        onClick={clearCode}>
                        Clear
                    </button>
                    <button className="shadow-lg duration-500 rounded-md p-2 bg-sky-700 hover:bg-sky-600 text-white dark:text-blue-300 dark:bg-boxdark dark:border-2 dark:border-white"
                        onClick={generateCode}>
                        Generate Code
                    </button>
                </div>
            </div>

            <div className="mt-2 border-2 border-slate-800">
                <div className="flex text-xs justify-start bg-slate-600">
                    <a
                        type='button'
                        ref={linkRef}
                        className="flex px-3 py-1 items-center text-center tracking-tight text-white hover:bg-slate-800 hover:font-bold duration-700 hover:cursor-pointer"
                    > download
                    </a>
                    <button
                        type='button'
                        onClick={() => copyToClipboard(generatedCode)} // Keep the existing button functionality
                        className="flex px-3 py-1 items-center text-center tracking-tight text-white hover:bg-slate-800 hover:font-bold duration-700"
                    > copy
                    </button>
                </div>
                {generatedCode && <div className="text-red-500 dark:text-white shadow-lg tracking-tight font-bold text-xs p-2 text-center z-9999">
                    Now that you've generated code, READ THE DOCS for how to best utilize it. Don't be reckless!
                </div>}
                <Editor
                    className="invert dark:invert-0 hue-rotate-180"
                    options={miniEditorOpts}
                    height={generatedCode ? "80vh" : "40vh"}
                    defaultLanguage='python'
                    theme="vs-dark"
                    value={generatedCode || '# Generated code will appear here (:'}
                    // onMount={handleEditorDidMount}
                    loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)}
                />
            </div>
        </div>
    )
}

export default StrategyCodeGen;