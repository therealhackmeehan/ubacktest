import { useContext, useState } from "react";
import ResultListItem from "./ResultListItem";
import { ResultWithStrategyName } from "../../../shared/sharedTypes";
import { GroupedResultContext } from "../ResultPage";
import StrategySpecificResultList from "./StrategySpecificResultList";

export interface ResultByStrategyProps {
  [key: string]: ResultWithStrategyName[];
}

function ResultList({
  results,
}: {
  results: ResultWithStrategyName[] | null | undefined;
}) {
  const { groupByStrategy, setGroupByStrategy } =
    useContext(GroupedResultContext);
  const [resultToHighlight, setResultToHighlight] = useState<string>("");

  // create a dictionary with each strategies' results
  const groupResultsByStrategy = (results: ResultWithStrategyName[]) => {
    const resultsByStrategy: ResultByStrategyProps = {};
    results.forEach((result) => {
      const key = result.fromStrategyID;
      if (key) {
        if (!resultsByStrategy[key]) {
          resultsByStrategy[key] = [];
        }
        resultsByStrategy[key].push(result);
      }
    });

    return resultsByStrategy;
  };

  return (
    <>
      {results && results.length > 0 ? (
        <>
          <div className="text-end">
            <label className="inline-flex items-center cursor-pointer">
              <input
                data-testid="group-by-parent"
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={groupByStrategy}
                onChange={() => setGroupByStrategy(!groupByStrategy)}
              ></input>
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-700 dark:peer-checked:bg-blue-300"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-white">
                Group By Parent Strategy
              </span>
            </label>
          </div>
          {groupByStrategy ? (
            Object.entries(groupResultsByStrategy(results)).map(
              ([strategyId, resultsByStrategy]) => (
                <StrategySpecificResultList
                  strategyId={strategyId}
                  resultsByStrategy={resultsByStrategy}
                  resultToHighlight={resultToHighlight}
                  setResultToHighlight={setResultToHighlight}
                />
              ),
            )
          ) : (
            <ul className="space-y-2 my-4">
              {results.map(({ strategyName, ...rest }) => (
                <ResultListItem key={rest.id} result={rest} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="text-center dark:text-white">
          No results found. Create one by running a strategy and saving the
          result.
        </div>
      )}
    </>
  );
}

export default ResultList;
