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
        <>
        <div>
            results attached to this strategy
        </div>
            <div className="mt-12">
                {results && results.length > 0 ? (
                    <ul>
                        {results.map((result: Result) => (
                            <ResultDropDown key={result.id} result={result} />
                        ))}
                    </ul>
                ) : (
                    <div>No results found. Create one by running a strategy.</div>
                )}
            </div>
        </>
    )
}

export default StrategyResults;