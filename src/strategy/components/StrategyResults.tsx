import { Strategy } from "wasp/entities";
import { getResultsForStrategy, useQuery } from "wasp/client/operations";
import ResultListItem from "../../result/client/components/ResultListItem";

function StrategyResults({ strategy }: { strategy: Strategy }) {
    const { data: results, isLoading: isResultsLoading } = useQuery(getResultsForStrategy, {
        fromStrategyID: strategy.id,
    });

    return (
        <div className="my-10 bg-white rounded-lg p-4 dark:bg-boxdark-2">
            <div className="text-xl font-extrabold my-2 dark:text-white">
                Saved Results from{" "}
                <span className="text-sky-600 dark:text-blue-300 italic font-normal">
                    {strategy.name}
                </span>
            </div>
            {!isResultsLoading && results && (
                <ul className="space-y-2">
                    {results.map((result) => (
                        <ResultListItem key={result.id} result={result} />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default StrategyResults;
