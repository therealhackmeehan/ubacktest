import { Result } from "wasp/entities";
import { useState, useEffect } from "react";
import { getResultsForStrategy } from "wasp/client/operations";
import ResultDropDown from "../../../results/client/components/ResultsPageDD";

function StrategyResults({ id }: { id: string }) {

    const [results, setResults] = useState<Result[] | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            const r = await getResultsForStrategy({ fromStrategyID: id });
            console.log(r)
            setResults(r);
        };

        fetchResults();
    }, [id]);

    return (
        <div className="my-12">
            <div className="text-xl font-extrabold my-2">Saved <span className="text-sky-600">Results</span> 
                <span className="text-lg font-light"> from {id}</span></div>
            {results && results.length > 0 ? (
                <ul>
                    {results.map((result: Result) => (
                        <ResultDropDown key={result.id} result={result} />
                    ))}
                </ul>
            ) : (
                <div className="text-center">No results found. Create one by running a strategy and saving the result.</div>
            )}
        </div>
    )
}

export default StrategyResults;