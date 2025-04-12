import { useState, useContext, useEffect } from "react";
import Editor from "./editor/Editor";
import ResultLayout from "./result/ResultLayout";
import { FormInputProps, StatProps, StrategyResultProps } from "../../../shared/sharedTypes";
import { StrategyContext } from "../EditorPage";
import StrategyHeader from "./editor/StrategyHeader";
import WarningModal from "./modals/WarningModal";

export interface stdProps {
    out: string;
    err: string;
}

export function addMonths(date: Date, months: number): string {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    newDate.setHours(0, 0, 0, 0);
    return newDate.toISOString().slice(0, 10);
}

export const initFormInputs: FormInputProps = {
    symbol: 'AAPL',
    startDate: addMonths(new Date(), -12), // 12 months ago
    endDate: addMonths(new Date(), -6), // 6 months ago
    intval: '1d',
    timeout: 12,
    costPerTrade: 0,
    useWarmupDate: false,
    warmupDate: addMonths(new Date(), -13),
};

function StrategyEditor() {

    const { selectedStrategy, hasSaved } = useContext(StrategyContext);

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

    const[stats, setStats] = useState<StatProps | null>(null);
    
    const loadFormInputs = () => {
        const savedInputs = localStorage.getItem('formInputs');
        return savedInputs ? JSON.parse(savedInputs) : initFormInputs;
    };

    const [formInputs, setFormInputs] = useState<FormInputProps>(loadFormInputs);

    const [std, setStd] = useState<stdProps>({
        out: '',
        err: '',
    });

    // Save to localStorage whenever formInputs changes
    useEffect(() => {
        localStorage.setItem('formInputs', JSON.stringify(formInputs));
    }, [formInputs]);

    useEffect(() => {
        // Define the beforeunload event handler
        // Don't auto-refresh if unsaved result!
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!hasSaved && strategyResult) {
                event.preventDefault();
                return "";
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasSaved, strategyResult]); // Re-run if `hasSaved` changes

    return (
        <div className="h-full flex flex-col bg-white dark:bg-boxdark">
            <StrategyHeader />

            <button
                className={`w-full duration-700 ease-in-out py-1 px-12 
                            hover:font-extrabold
                            tracking-tight 
                            ${resultOpen ?
                        'bg-sky-700 text-white dark:bg-blue-300 dark:text-black' :
                        'bg-slate-200 text-black dark:bg-boxdark-2 dark:text-white'}`}

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
                    stats={stats}
                />
            ) : (
                <Editor
                    strategyResult={strategyResult}
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
                    setStats={setStats}
                />
            )}
        </div>
    )
}

export default StrategyEditor;