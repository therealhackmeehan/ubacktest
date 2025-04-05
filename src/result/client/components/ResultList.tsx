import { useState } from "react";
import { Result } from "wasp/entities";
import ResultListItem from "./ResultListItem";

function ResultList({ results }: { results: Result[] | null | undefined }) {

    const [showAll, setShowAll] = useState(false);
    const toggleShowAll = () => setShowAll((prev) => !prev);

    const [groupByStrategy, setGroupByStrategy] = useState<boolean>(false);

    const groupResultsByStrategy = (results: Result[]) => {
        const groups: {
            [key: string]: { results: Result[]; avgPL: number };
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
                    <div className="flex justify-end gap-x-4 items-center">
                        <div className="text-lg tracking-tight text-center dark:text-white">
                            Group by Strategy
                        </div>
                        <input type="checkbox" checked={groupByStrategy} onChange={() => setGroupByStrategy(!groupByStrategy)}>
                        </input>
                    </div>
                    {groupByStrategy ? (
                        Object.entries(groupResultsByStrategy(showAll ? results : results.slice(0, 10)))
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([strategyID, group]) => (
                                <div key={strategyID} className="mb-4">
                                    <h3 className="text-md font-semibold text-slate-600 dark:text-slate-200 mb-2">
                                        Strategy: {strategyID} (Avg P/L: {group.avgPL.toFixed(2)})
                                    </h3>
                                    <ul className="space-y-2">
                                        {group.results.map((result) => (
                                            <ResultListItem key={result.id} result={result} />
                                        ))}
                                    </ul>
                                </div>
                            ))
                    ) : (
                        <ul className="space-y-2">
                            {(showAll ? results : results.slice(0, 10)).map((result) => (
                                <ResultListItem key={result.id} result={result} />
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