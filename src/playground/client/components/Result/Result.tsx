import ResultPanel from "./ResultPanel";
import { FormInputProps } from "../../../../shared/sharedTypes";

interface ResultProps {
    stockData: any;
    formInputs: FormInputProps;
    strategyResultIsConnectedTo: string;
    selectedStrategy: string;
}

export default function Result({ stockData, formInputs, strategyResultIsConnectedTo, selectedStrategy }: ResultProps) {

    if ((!stockData) || (strategyResultIsConnectedTo !== selectedStrategy)) {
        return (
            <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">
                No Results to Display for This Strategy
            </div>
        );
    }

    return (
        <ResultPanel selectedStrategy={selectedStrategy} formInputs={formInputs} stockData={stockData} abilityToSaveNew={true}/>
    );
};
