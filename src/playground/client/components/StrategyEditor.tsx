import { useState, useContext, useEffect } from "react";
import Editor from "./editor/Editor";
import ResultLayout from "./result/ResultLayout";
import { FormInputProps, StrategyResultProps } from "../../../shared/sharedTypes";
import { StrategyContext } from "../EditorPage";
import StrategyHeader from "./editor/StrategyHeader";
import WarningModal from "./modals/WarningModal";

export interface stdProps {
    out: string;
    err: string;
}

function addMonths(date: Date, months: number): string {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    newDate.setHours(0, 0, 0, 0);
    return newDate.toISOString().slice(0,10);
}

const initFormInputs: FormInputProps = {
    symbol: 'aapl',
    startDate: addMonths(new Date(), -12), // 12 months ago
    endDate: addMonths(new Date(), -6), // 6 months ago
    intval: '1d',
    timeOfDay: 'close',
    costPerTrade: 0,
    useWarmupDate: false,
    warmupDate: addMonths(new Date(), -13),
};

function StrategyEditor() {

    const { selectedStrategy } = useContext(StrategyContext);

    const [codeToDisplay, setCodeToDisplay] = useState<string>(selectedStrategy.code);
    useEffect(() => {
        if (selectedStrategy) {
            setCodeToDisplay(selectedStrategy.code);
        }
    }, [selectedStrategy]);

    const [warningMsg, setWarningMsg] = useState<string | null>('');
    const [resultOpen, setResultOpen] = useState<boolean>(false);
    const [strategyResult, setStrategyResult] = useState<StrategyResultProps | null>(null);
    const [strategyResultIsConnectedTo, setStrategyResultIsConnectedTo] = useState<string>('');
    const [formInputs, setFormInputs] = useState<FormInputProps>(initFormInputs);
    const [std, setStd] = useState<stdProps>({
        out: '',
        err: '',
    });

    return (
        <>
            <StrategyHeader />

            <button
                className={`w-full duration-700 ease-in-out py-1 px-12 
                            hover:font-extrabold
                            tracking-tight 
                            ${resultOpen ?
                        'bg-sky-800 text-white' :
                        'bg-slate-200 text-sky-800'}`}

                onClick={() => setResultOpen(!resultOpen)}
            >
                Toggle To {resultOpen ? 'Editor' : 'Result'}
            </button>

            {warningMsg && <WarningModal closeModal={() => setWarningMsg('')} msg={warningMsg} />}

            {resultOpen ? (
                <ResultLayout
                    strategyResult={strategyResult}
                    formInputs={formInputs}
                    strategyResultIsConnectedTo={strategyResultIsConnectedTo}
                    selectedStrategy={selectedStrategy.id}
                />
            ) : (
                <Editor
                    setStrategyResult={setStrategyResult}
                    setResultOpen={setResultOpen}
                    formInputs={formInputs}
                    setFormInputs={setFormInputs}
                    setStrategyResultIsConnectedTo={setStrategyResultIsConnectedTo}
                    std={std}
                    setStd={setStd}
                    codeToDisplay={codeToDisplay}
                    setCodeToDisplay={setCodeToDisplay}
                    setWarningMsg={setWarningMsg}
                />
            )}
        </>
    )
}

export default StrategyEditor;