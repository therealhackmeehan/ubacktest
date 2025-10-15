import { useQuery, getShared } from "wasp/client/operations";
import { useState } from "react";
import SharedResultItem from "./SharedResultItem";
import { GetSharedProps } from "../../../shared/sharedTypes";
import LoadingScreen from "../../../client/components/LoadingScreen";

function SharedList() {
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll((prev) => !prev);
  const { data: results, isLoading: isResultsLoading } = useQuery(getShared);

  if (isResultsLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="my-3 md:mx-3 p-2 rounded-lg bg-slate-100 shadow-lg dark:bg-boxdark-2">
      {results && results.length > 0 ? (
        <>
          <ul>
            {(showAll ? results : results.slice(0, 10)).map(
              (result: GetSharedProps) => (
                <SharedResultItem key={result.id} result={result} />
              )
            )}
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
          No results found. If someone were to share a result with you, it would
          appear here.
        </div>
      )}
    </div>
  );
}

export default SharedList;
