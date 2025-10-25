import { useQuery, getResults } from "wasp/client/operations";
import LoadingScreen from "../../../client/components/LoadingScreen";
import ResultList from "./ResultList";

function MyResults() {
  const { data: results, isLoading: isResultsLoading } = useQuery(getResults);

  return (
    <>
      {isResultsLoading ? <LoadingScreen /> : <ResultList results={results} />}
    </>
  );
}

export default MyResults;
