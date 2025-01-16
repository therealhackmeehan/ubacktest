import { FormInputProps, StrategyResultProps } from "../../../../shared/sharedTypes";
import Result from "./Result";

interface ResultProps {
    strategyResult: StrategyResultProps | null;
    formInputs: FormInputProps;
    strategyResultIsConnectedTo: string;
    selectedStrategy: string;
}

export default function ResultLayout({ strategyResult, formInputs, strategyResultIsConnectedTo, selectedStrategy }: ResultProps) {

    if ((!strategyResult) || (strategyResultIsConnectedTo !== selectedStrategy)) {
        return (
            <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">
                No Current Result to Display for This Strategy
            </div>
        );
    }

    return (
        <Result selectedStrategy={selectedStrategy} formInputs={formInputs} strategyResult={strategyResult} abilityToSaveNew={true}/>
    );
};
