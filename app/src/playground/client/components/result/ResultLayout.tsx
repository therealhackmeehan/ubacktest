import {
  FormInputProps,
  StrategyResultProps,
  StatProps,
} from "../../../../shared/sharedTypes";
import Result from "./Result";

interface ResultProps {
  strategyResult: StrategyResultProps | null;
  formInputs: FormInputProps;
  strategyResultIsConnectedTo: string;
  selectedStrategy: string;
  stats: StatProps | null;
}

export default function ResultLayout({
  strategyResult,
  formInputs,
  strategyResultIsConnectedTo,
  selectedStrategy,
  stats,
}: ResultProps) {
  if (
    !strategyResult ||
    !stats ||
    strategyResultIsConnectedTo !== selectedStrategy
  ) {
    return (
      <div className="select-none border-2 p-4 border-black font-extrabold m-4 lg:m-12 blur-sm text-5xl text-slate-800/30 tracking-tight dark:text-white dark:border-white">
        No Current Result to Display for This Strategy
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Result
        selectedStrategy={selectedStrategy}
        formInputs={formInputs}
        strategyResult={strategyResult}
        stats={stats}
        abilityToSaveNew={true}
      />
    </div>
  );
}
