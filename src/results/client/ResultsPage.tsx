import { type Result } from 'wasp/entities';
import ResultDropDown from "./components/ResultsPageDD";
import { getResults, useQuery } from "wasp/client/operations"
import ContentWrapper from '../../client/components/ContentWrapper';

export default function ResultsPage() {

    const { data: results, isLoading: isResultsLoading } = useQuery(getResults);

    return (
        <ContentWrapper>
            <h4 className='my-2 font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white'>
                My <span className='text-sky-600'>Saved Results</span>
            </h4>
            <div className='border-b-2 w-full border-slate-400'></div>
            <div className="mt-12">
                {isResultsLoading ? (
                    <div className="text-2xl">Loading...</div>
                ) : results ? (
                    <ul>
                        {results.map((result: Result) => (
                            <ResultDropDown key={result.id} result={result} />
                        ))}
                    </ul>
                ) : (
                    <div>No results found. Create one by running a strategy.</div>
                )}
            </div>
        </ContentWrapper>
    )

}