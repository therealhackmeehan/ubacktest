import { useState } from "react";
import { Result } from "wasp/entities";
import ResultListItem from "./ResultListItem";
import { ResultWithStrategyName } from "../../../playground/server/resultOperations";

function ResultList({ results }: { results: ResultWithStrategyName[] | null | undefined }) {

    const [showAll, setShowAll] = useState(false);
    const toggleShowAll = () => setShowAll((prev) => !prev);

    const [groupByStrategy, setGroupByStrategy] = useState<boolean>(false);
    const groupResultsByStrategy = (results: ResultWithStrategyName[]) => {
        const groups: {
            [key: string]: { results: ResultWithStrategyName[]; avgPL: number };
        } = {};

        results.forEach((result) => {
            const key = result.fromStrategyID;
            if (key) {
                if (!groups[key]) {
                    groups[key] = { results: [], avgPL: 0 };
                }
                groups[key].results.push(result);
            }
        });

        // Now calculate avgPL for each group
        for (const key in groups) {
            const group = groups[key];
            const total = group.results.reduce((sum, r) => sum + r.profitLoss, 0);
            group.avgPL = group.results.length ? total / group.results.length : 0;
        }

        return groups;
    };

    return (
        <>
            {(results && results.length > 0) ? (
                <>
                    <div className="text-end">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked={groupByStrategy} onChange={() => setGroupByStrategy(!groupByStrategy)}></input>
                            <div className="relative w-11 h-6 bg-gray-200 dark:bg-black rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-700 dark:peer-checked:bg-blue-300"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-blue-300">Group By Strategy</span>
                        </label>
                    </div>
                    {groupByStrategy ? (
                        Object.entries(groupResultsByStrategy(showAll ? results : results
                            .slice(0, 10)))
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([strategyId, group]) => (
                                <div key={strategyId} className="mb-4">
                                    <h3 className="font-semibold text-slate-700 dark:text-white mb-2 pb-1 flex justify-start items-center gap-x-2 border-b-2 border-black/30 dark:border-white/30">
                                        <div className="text-sm font-light">strategy</div>
                                        <div className="italic text-lg">{group.results[0]?.strategyName ?? "Unknown"}</div>
                                        <div className="font-mono text-sm text-sky-700 dark:text-blue-300">
                                            average P/L: {group.avgPL.toFixed(2)}%
                                        </div>
                                    </h3>
                                    <ul className="space-y-2">
                                        {group.results.map(({ strategyName, ...rest }) => (
                                            <ResultListItem key={rest.id} result={rest} />
                                        ))}
                                    </ul>
                                </div>
                            ))
                    ) : (
                        <ul className="space-y-2">
                            {(showAll ? results : results
                                .slice(0, 10))
                                .map(({ strategyName, ...rest }) => (
                                    <ResultListItem key={rest.id} result={rest} />
                                ))}
                        </ul>
                    )}
                    {results.length > 10 && (
                        <button
                            onClick={toggleShowAll}
                            className="w-full px-2 py-1 rounded-md bg-slate-100 border-2 border-slate-500 hover:shadow hover:bg-slate-200 hover:italic duration-700 dark:bg-boxdark dark:text-white"
                        >
                            {showAll ? "Show Less" : "See All"}
                        </button>
                    )}
                </>
            ) : (
                <div className="text-center dark:text-white">
                    No results found. Create one by running a strategy and saving the result.
                </div>
            )}
        </>
    )

}

export default ResultList;