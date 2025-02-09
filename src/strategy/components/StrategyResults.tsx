import { Strategy } from "wasp/entities";
import { getResultsForStrategy, useQuery } from "wasp/client/operations";
import ResultList from "../../result/client/components/ResultList";

function StrategyResults({ strategy }: { strategy: Strategy }) {

    const { data: results, isLoading: isResultsLoading } = useQuery(getResultsForStrategy, {
        fromStrategyID: strategy.id
    })

    return (
        <div className="my-10 bg-white rounded-lg p-4 shadow-lg border-2 border-black duration-1000">
            <div className="text-xl font-extrabold my-2">
                Saved Results from <span className="text-sky-600 italic font-normal">{strategy.name}</span>
            </div>
            {!isResultsLoading && <ResultList results={results} />}
        </div>
    )
}

export default StrategyResults;
