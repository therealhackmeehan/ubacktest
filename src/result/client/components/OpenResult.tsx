import { useState, useRef, useEffect } from "react";
import { FormInputProps, StatProps, StrategyResultProps, UserDefinedData } from "../../../shared/sharedTypes";
import copyToClipboard from "./copyToClipboard";
import { Result } from "wasp/entities";
import LoadingScreen from "../../../client/components/LoadingScreen";
import ResultPanel from "../../../playground/client/components/result/Result";
import { runStrategy } from "wasp/client/operations";
import ErrorModal from "../../../playground/client/components/modals/ErrorModal";
import { TiCancel } from "react-icons/ti";

interface OpenResultProps {
    formInputs: FormInputProps;
    setResultPanelOpen: (value: boolean) => void;
    result: Result;
}

export default function OpenResult({ formInputs, setResultPanelOpen, result }: OpenResultProps) {
    const [strategyResult, setStrategyResult] = useState<StrategyResultProps | null>(null);
    const [statResult, setStatResult] = useState<StatProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const hasRun = useRef(false); // Track if useEffect has run

    function pick<T>(obj: any, keys: (keyof T)[]): T {
        const picked: Partial<T> = {};
        for (const key of keys) {
            picked[key] = obj[key];
        }
        return picked as T;
    }

    useEffect(() => {

        if (hasRun.current) return; // Prevent re-running
        hasRun.current = true; // Mark as run

        const fetchStrategyResult = async () => {
            setLoading(true);
            setErrMsg(""); // Reset error on new fetch

            try {
                if (!result.open || !result.close || !result.portfolio) {
                    throw new Error("This result was not correctly loaded and is missing critical data arrays.");
                }
                // const joinedInfo: StrategyResultProps = {
                //     timestamp: result.timestamp,
                //     open: result.open,
                //     close: result.close,
                //     high: result.high,
                //     low: result.low,
                //     volume: result.volume,

                //     signal: result.signal,
                //     returns: result.returns,

                //     sp: result.sp,

                //     portfolio: result.portfolio,
                //     portfolioWithCosts: result.portfolioWithCosts,

                //     cash: result.cash,
                //     equity: result.equity,

                //     cashWithCosts: result.cashWithCosts,
                //     equityWithCosts: result.equityWithCosts,

                //     userDefinedData: result.userDefinedData as unknown as UserDefinedData,
                // };
                // setStrategyResult(joinedInfo);

                // const joinedStats: StatProps = {
                //     length: result.length,
                //     pl: result.pl,
                //     plWCosts: result.plWCosts,
                //     cagr: result.cagr,
                //     numTrades: result.numTrades,
                //     numProfTrades: result.numProfTrades,
                //     percTradesProf: result.percTradesProf,
                //     sharpeRatio: result.sharpeRatio,
                //     sortinoRatio: result.sortinoRatio,
                //     maxDrawdown: result.maxDrawdown,
                //     maxGain: result.maxGain,
                //     meanReturn: result.meanReturn,
                //     stddevReturn: result.stddevReturn,
                //     maxReturn: result.maxReturn,
                //     minReturn: result.minReturn,
                // };

                // setStatResult(joinedStats);

                const strategyKeys: (keyof StrategyResultProps)[] = [
                    "timestamp", "open", "close", "high", "low", "volume",
                    "signal", "returns", "sp", "portfolio", "portfolioWithCosts",
                    "cash", "equity", "cashWithCosts", "equityWithCosts", "userDefinedData"
                ];

                const statKeys: (keyof StatProps)[] = [
                    "length", "pl", "plWCosts", "cagr", "numTrades", "numProfTrades",
                    "percTradesProf", "sharpeRatio", "sortinoRatio", "maxDrawdown",
                    "maxGain", "meanReturn", "stddevReturn", "maxReturn", "minReturn"
                ];

                setStrategyResult(pick<StrategyResultProps>(result, strategyKeys));
                setStatResult(pick<StatProps>(result, statKeys));

            } catch (error: any) {
                setErrMsg(`Error running strategy: ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStrategyResult();
    }, []); // Empty dependency array ensures it runs only once

    useEffect(() => {
        if (strategyResult) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = ""; // Cleanup on unmount
        };
    }, [strategyResult]);

    return (
        <>
            {errMsg && <ErrorModal msg={errMsg} closeModal={() => setErrMsg("")} />}

            {loading && !errMsg && <LoadingScreen />}

            {strategyResult && statResult && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 w-full bg-gray-800 opacity-50" onClick={() => setResultPanelOpen(false)}></div>
                    <div className="z-10 w-11/12 h-5/6 p-4 bg-white border-2 border-black rounded-lg shadow-xl overflow-y-auto">
                        <button
                            onClick={() => setResultPanelOpen(false)}
                            className="flex justify-between items-center text-xs justify-self-center gap-x-12 text-center p-1 text-red-500 border-2 border-red-200 rounded-md hover:font-extrabold hover:bg-red-100 hover:text-red-400"
                        >
                            Close
                            <TiCancel />
                        </button>
                        <ResultPanel
                            strategyResult={strategyResult}
                            formInputs={formInputs}
                            selectedStrategy={result.fromStrategyID}
                            stats={statResult}
                            abilityToSaveNew={false}
                        />
                        <div onClick={() => copyToClipboard(result.code)} className="px-8 mx-auto min-w-187.5">
                            <textarea
                                className="w-full h-100 p-4 text-xs font-mono bg-slate-100 border border-white rounded-lg resize-none hover:bg-slate-200 hover:cursor-pointer"
                                value={result.code}
                                readOnly
                            />
                            <div className="text-xs font-extrabold text-end -translate-y-8 -translate-x-8">Click to copy</div>
                            <div className="text-lg font-bold tracking-tight text-center text-slate-300 -translate-y-4">
                                Source Code
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
