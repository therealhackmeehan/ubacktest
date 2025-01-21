import { useState, useContext, useEffect} from "react";
import Editor from "./editor/Editor";
import ResultLayout from "./result/ResultLayout";
import { FormInputProps, StrategyResultProps } from "../../../shared/sharedTypes";
import { StrategyContext } from "../EditorPage";
import StrategyHeader from "./editor/StrategyHeader";

export interface stdProps {
    out: string;
    err: string;
}

function addMonths(date: Date, months: number): Date{
    date.setMonth(date.getMonth() + months);
    return date;
  }

const initFormInputs: FormInputProps = {
    symbol: 'aapl',
    startDate: addMonths(new Date(), -12), // 12 months ago
    endDate: addMonths(new Date(), -6), // 6 months ago
    intval: '1d',
    timeOfDay: 'close',
    costPerTrade: 0,
};

function StrategyEditor() {

    const { selectedStrategy } = useContext(StrategyContext);

    const [codeToDisplay, setCodeToDisplay] = useState<string>(selectedStrategy.code);
    useEffect(() => {
        if (selectedStrategy) {
            setCodeToDisplay(selectedStrategy.code);
        }
    }, [selectedStrategy]);

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
                        'bg-slate-700 text-white' :
                        'bg-slate-200 text-sky-800'}`}

                onClick={() => setResultOpen(!resultOpen)}
            >
                Toggle To {resultOpen ? 'Editor' : 'Result'}
            </button>

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
                />
            )}
        </>
    )
}

export default StrategyEditor;