import ContentWrapper from "../client/components/ContentWrapper";
import LoadingScreen from "../client/components/LoadingScreen";
import { useQuery, getTopResults } from "wasp/client/operations";
import type { Result } from 'wasp/entities';
import LeaderboardItem from "./LeaderboardItem";

function LeaderboardPage() {
    const { data: topResults, isLoading: isLeaderboardLoading, error: leaderboardError } = useQuery(getTopResults);

    if (isLeaderboardLoading) return <LoadingScreen />;

    if (!isLeaderboardLoading && leaderboardError) return (
        <ContentWrapper>
            <div className="m-8 font-bold text-center">Something went wrong</div>
        </ContentWrapper>);

    return (
        <ContentWrapper>
            <div className="m-2 p-4 bg-gradient-to-tr from-sky-700 to-white duration-1000 rounded-lg shadow-xl">
                <div className="text-3xl text-end font-extrabold tracking-tight">Leaderboard</div>
            </div>
            <div className="text-center font-light my-4">
                These are the top strategies from all users, as marked by public, ranked by approximate annual profit/loss.
            </div>

            <div className="mt-12">
                {isLeaderboardLoading ? (
                    <div className="text-2xl">Loading...</div>
                ) : topResults ? (
                    <ul>
                        {topResults.map((result: Result, index: number) => (
                            <LeaderboardItem result={result} index={index}/>
                        ))}
                    </ul>
                ) : (
                    <div>No public results found.</div>
                )}
            </div>
        </ContentWrapper>
    );
}

export default LeaderboardPage;