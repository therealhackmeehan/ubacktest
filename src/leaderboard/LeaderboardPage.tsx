import { useState } from "react";
import ContentWrapper from "../client/components/ContentWrapper";
import LoadingScreen from "../client/components/LoadingScreen";
import { useQuery } from "wasp/client/operations";
import { getTopResults } from "wasp/client/operations";
import LeaderboardItem from "./LeaderboardItem";
import { ResultWithUsername } from "../playground/server/resultOperations";

export const softModernColors = [
    "bg-blue-300", "bg-teal-300", "bg-green-300",
    "bg-purple-200", "bg-indigo-300", "bg-sky-300"
];

export const randomColor = () => {
    return softModernColors[Math.floor(Math.random() * softModernColors.length)];
};

function LeaderboardPage() {
    const { data: topResults, isLoading: isLeaderboardLoading, error: leaderboardError } = useQuery(getTopResults);

    const [isProfitLoss, setIsProfitLoss] = useState(true); // Track which leaderboard is active

    if (isLeaderboardLoading) return <LoadingScreen />;

    if ((!isLeaderboardLoading && leaderboardError) || !topResults) {
        return (
            <ContentWrapper>
                <div className="m-8 font-bold text-center">Something went wrong.</div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper>
            <div className="max-w-3xl mx-auto">
                <div className="m-2 p-4 bg-gradient-to-tr from-sky-700/50 to-white duration-1000 rounded-lg shadow-xl">
                    <div className="text-3xl text-end font-extrabold tracking-tight"><span className="text-xs">global </span>Leaderboard</div>
                </div>
                <div className="text-center text-sm font-light my-4">
                    <p>Saved results are public by default, but your code is <span className="italic">never</span> public. Only your success.</p>
                </div>
                <div className="mt-12 p-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-300">
                    <button
                        className="p-1 mb-4 font-bold text-xs justify-self-center tracking-tight rounded-md bg-white flex"
                        onClick={() => setIsProfitLoss(!isProfitLoss)}
                    >
                        <div className={`duration-1000 ${!isProfitLoss ? "text-black" : "text-slate-200"}`}>
                            Annualized Profit/Loss
                        </div>
                        <div className="border-2 border-sky-700 mx-2"></div>
                        <div className={`duration-1000 ${isProfitLoss ? "text-black" : "text-slate-200"}`}>
                            Total Profit/Loss
                        </div>
                    </button>
                    {
                        isProfitLoss ? (
                            topResults.topByProfitLoss && topResults.topByProfitLoss.length > 0 ? (
                                <ul>
                                    {topResults.topByProfitLoss.map((result: ResultWithUsername, index: number) => (
                                        <LeaderboardItem key={index} result={result} index={index} />
                                    ))}
                                </ul>
                            ) : (
                                <div>No public results found.</div>
                            )
                        ) : (
                            topResults.topByAnnualizedProfitLoss && topResults.topByAnnualizedProfitLoss.length > 0 ? (
                                <ul>
                                    {topResults.topByAnnualizedProfitLoss.map((result: ResultWithUsername, index: number) => (
                                        <LeaderboardItem key={index} result={result} index={index} />
                                    ))}
                                </ul>
                            ) : (
                                <div>No public results found.</div>
                            )
                        )
                    }

                </div>
                <div className="text-sm m-1 text-sky-700">
                    You can toggle the privacy of your result on your results page.
                </div>
            </div>
        </ContentWrapper>
    );
}

export default LeaderboardPage;
