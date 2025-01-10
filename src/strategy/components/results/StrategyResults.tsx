import { Result } from "wasp/entities";
import { useState, useEffect } from "react";
import { getResultsForStrategy } from "wasp/client/operations";
import ResultListItem from "./components/ResultListItem";

interface StrategyResultProps {
    id: string;
    name: string;
}
function StrategyResults({ id, name }: StrategyResultProps) {

    const [results, setResults] = useState<Result[] | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            const r = await getResultsForStrategy({ fromStrategyID: id });
            setResults(r);
        };

        fetchResults();
    }, [id]);

    return (
        <div className="my-12">
            <div className="text-xl font-extrabold my-2">Saved Results from <span className="text-sky-600 italic font-normal">this Strategy</span>
            </div>
            {results && results.length > 0 ? (
                <ul>
                    {results.map((result: Result) => (
                        <ResultListItem key={result.id} result={result} />
                    ))}
                </ul>
            ) : (
                <div className="text-center">No results found. Create one by running a strategy and saving the result.</div>
            )}
        </div>
    )
}

export default StrategyResults;