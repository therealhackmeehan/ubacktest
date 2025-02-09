import { useState, useEffect } from "react";
import { FormInputProps, StrategyResultProps } from "../../../shared/sharedTypes";
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
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        const fetchStrategyResult = async () => {
            setLoading(true);
            setErrMsg(""); // Reset error on new fetch

            try {
                if (result.data) {
                    setStrategyResult(result.data as unknown as StrategyResultProps);
                } else {
                    const { strategyResult } = await runStrategy({ formInputs, code: result.code });
                    if (!strategyResult) {
                        throw new Error("That result could not be found. The strategy result could not be regenerated.");
                    }
                    setStrategyResult(strategyResult);
                }
            } catch (error: any) {
                setErrMsg(`Error running strategy: ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStrategyResult();
    }, [result, formInputs]);

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

            {strategyResult && (
                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-50">
                    <div className="fixed inset-0 w-full bg-black/70"></div>
                    <div className="relative z-10 w-11/12 h-5/6 p-4 bg-white border-2 border-black rounded-lg shadow-xl overflow-y-auto">
                        <button
                            onClick={() => setResultPanelOpen(false)}
                            className="flex justify-between items-center text-xs justify-self-center gap-x-6 text-center p-1 text-red-500 border-2 border-red-200 rounded-md hover:font-extrabold hover:bg-red-100 hover:text-red-400"
                        >
                            Close
                            <TiCancel />
                        </button>
                        <ResultPanel
                            strategyResult={strategyResult}
                            formInputs={formInputs}
                            selectedStrategy={result.fromStrategyID}
                            abilityToSaveNew={false}
                        />
                        <div onClick={() => copyToClipboard(result.code)} className="max-w-7xl px-8 mx-auto">
                            <textarea
                                className="w-full h-72 p-4 text-xs font-mono bg-slate-100 border border-white rounded-lg resize-none hover:bg-slate-200 hover:cursor-pointer"
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
