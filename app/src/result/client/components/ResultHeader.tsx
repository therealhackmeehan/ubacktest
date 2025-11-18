import SmallPlot from "./SmallPlot";
import { type Result } from "wasp/entities";

interface ResultHeaderProps {
  result: Result;
  setResultPanelOpen: (val: boolean) => void;
}

function ResultHeader({ result, setResultPanelOpen }: ResultHeaderProps) {
  return (
    <div className="flex justify-between gap-x-3 mb-3 md:mb-0">
      <button
        className="tracking-tight md:text-xl font-semibold hover:text-sky-700 dark:text-white"
        onClick={() => setResultPanelOpen(true)}
      >
        {result.name}
      </button>
      <div className="text-xs border-l-2 border-black/40 px-2 py-1 md:py-0 bg-white dark:bg-boxdark dark:text-white">
        P/L: <span className="md:text-lg">{result.pl?.toFixed(2)}%</span>
      </div>
      <div className="p-1 dark:brightness-200 hidden md:flex">
        <SmallPlot portfolio={result.portfolio} />
      </div>
    </div>
  );
}

export default ResultHeader;
