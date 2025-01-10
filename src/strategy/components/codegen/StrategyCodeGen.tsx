import { useState } from "react";

function StrategyCodeGen({ code }: { code: string | null }) {
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [intval, setIntval] = useState<string>('5d');
    const [realMoney, setRealMoney] = useState<string>('false')
    const [symbol, setSymbol] = useState<string>('AAPL');

    return (
        <div className="mt-18">
            <div className="my-2 text-xl text-slate-800 tracking-tight font-extrabold">
                <span className="text-sky-600">Deploy this Strategy</span> with Real or Paper Money
            </div>
            <div className="rounded-md bg-slate-100 border-slate-200 border-2 p-2 flex justify-between">
                <div className="flex justify-start gap-x-3 items-center">
                    <div>Trading Interval</div>
                    <select
                        className="rounded-lg"
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
                    <div>Stock To Trade</div>
                    <input
                        className="rounded-lg"
                        type='text'
                        value={symbol}
                        onChange={(e) => setSymbol(e.currentTarget.value)}
                    />
                    <div>Real Money</div>
                    <select
                        className="rounded-lg"
                        value={realMoney}
                        onChange={(e) => setRealMoney(e.currentTarget.value)}
                    >
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                </div>
                <button className="border-2 border-black rounded-md p-2 bg-green-100 hover:bg-green-700 hover:text-white shadow-sm">
                    Generate Code
                </button>
            </div>

            <div className="mt-2 border-2 border-slate-400">
                <div className="flex text-xs justify-start border-b-2 border-black">
                    <button
                        type='button'
                        onClick={() => (console.log())} // Keep the existing button functionality
                        className="flex px-3 py-1 items-center text-center tracking-tight text-gray-800 hover:bg-slate-100 hover:font-bold"
                    > download
                    </button>
                    <button
                        type='button'
                        onClick={() => (console.log())} // Keep the existing button functionality
                        className="flex px-3 py-1 items-center text-center tracking-tight text-gray-800 hover:bg-slate-100 hover:font-bold"
                    > copy
                    </button>
                </div>
                {!generatedCode &&
                    <div className="py-48 text-center font-light tracking-tight text-black/40 bg-slate-50">
                        Generated Code Will Appear Here.
                    </div>
                }

            </div>
        </div>
    )
}

export default StrategyCodeGen;