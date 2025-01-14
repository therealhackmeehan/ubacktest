import { Result, Strategy } from "wasp/entities";
import { useState, useEffect } from "react";
import { getResultsForStrategy } from "wasp/client/operations";
import ResultListItem from "./components/ResultListItem";

function StrategyResults({ strategy }: { strategy: Strategy }) {
    const [results, setResults] = useState<Result[] | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            const r = await getResultsForStrategy({ fromStrategyID: strategy.id });
            setResults(r);
        };

        fetchResults();
    }, [strategy]);

    const toggleShowAll = () => setShowAll((prev) => !prev);

    return (
        <div className="my-10 bg-white rounded-lg p-4 shadow-lg border-2 border-black duration-1000">
            <div className="text-xl font-extrabold my-2">
                Saved Results from <span className="text-sky-600 italic font-normal">{strategy.name}</span>
            </div>
            {results && results.length > 0 ? (
                <>
                    <ul>
                        {(showAll ? results : results.slice(0, 5)).map((result: Result) => (
                            <ResultListItem key={result.id} result={result} />
                        ))}
                    </ul>
                    {results.length > 5 && (
                        <button
                            onClick={toggleShowAll}
                            className="w-full px-2 py-1  rounded-md bg-slate-100 border-2 border-slate-500 hover:shadow hover:bg-slate-200 hover:italic duration-700"
                        >
                            {showAll ? "Show Less" : "See All"}
                        </button>
                    )}
                </>
            ) : (
                <div className="text-center">
                    No results found. Create one by running a strategy and saving the result.
                </div>
            )}
        </div>
    );
}

export default StrategyResults;
