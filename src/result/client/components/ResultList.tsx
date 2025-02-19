import { useState } from "react";
import { Result } from "wasp/entities";
import ResultListItem from "./ResultListItem";

function ResultList({ results }: { results: Result[] | null | undefined }) {

    const [showAll, setShowAll] = useState(false);
    const toggleShowAll = () => setShowAll((prev) => !prev);

    return (
        <>
            {(results && results.length > 0) ? (
                <>
                    <ul>
                        {(showAll ? results : results.slice(0, 10)).map((result: Result) => (
                            <ResultListItem key={result.id} result={result} />
                        ))}
                    </ul>
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