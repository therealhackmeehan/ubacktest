import { FiBookOpen } from "react-icons/fi";
import { useState } from "react";
import LeaderboardPlot from "./LeaderboardPlot";
import { ResultWithUsername } from "../shared/sharedTypes";
import { randomColor } from "./LeaderboardPage";

interface LeaderboardItemProps {
  result: ResultWithUsername;
  index: number;
}

function LeaderboardItem({ result, index }: LeaderboardItemProps) {
  const [leaderboardPlotOpen, setLeaderboardPlotOpen] =
    useState<boolean>(false);

  return (
    <>
      <div className="border-2 md:border-0 md:border-l-8 border-sky-700/20 dark:border-blue-300 rounded-md my-3 md:my-2 bg-white p-2 justify-between md:flex duration-700 dark:bg-black">
        <div className="px-1 mt-1 -mb-3 md:mb-0 md:px-3 flex items-center gap-x-3">
          <div className="text-xl md:text-title-lg font-bold dark:text-white">
            {index + 1}
          </div>
          <div
            className={`py-1 px-3 md:py-2 md:px-4 rounded-md md:rounded-xl ${randomColor()} text-white font-extrabold md:text-xl dark:text-black`}
          >
            {result.email.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="font-bold text-xs text-end tracking-tight md:flex gap-x-3 justify-end space-y-1 md:space-y-0">
          <div className="pb-2 md:py-2 m-1 text-sky-700 dark:text-blue-300 text-sm md:text-xs">
            @{result.email}
          </div>
          <div className="flex gap-x-4 justify-between py-1 px-2 rounded-md bg-slate-100 dark:bg-boxdark dark:text-white">
            CAGR{" "}
            <span className="text-xs md:text-lg text-sky-700 font-mono dark:text-blue-300">
              {result.cagr?.toFixed(2)}%
            </span>
          </div>
          <div className="flex gap-x-4 justify-between py-1 px-2 rounded-md bg-slate-200 dark:bg-boxdark dark:text-white">
            P/L{" "}
            <span className="text-xs md:text-lg text-sky-700 font-mono dark:text-blue-300">
              {result.pl?.toFixed(2)}%
            </span>
          </div>

          <button
            className="px-3 py-1 w-full md:w-auto flex rounded-md bg-slate-300 hover:shadow-lg items-center gap-x-2 dark:bg-white text-sm md:text-xs"
            onClick={() => setLeaderboardPlotOpen(true)}
          >
            view
            <FiBookOpen />
          </button>
        </div>
      </div>

      {leaderboardPlotOpen && (
        <LeaderboardPlot
          result={result}
          setLeaderboardPlotOpen={setLeaderboardPlotOpen}
          index={index + 1}
        />
      )}
    </>
  );
}

export default LeaderboardItem;
