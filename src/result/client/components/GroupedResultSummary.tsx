import { useState, useMemo } from "react";
import { DownArrow, UpArrow } from "../../../client/icons/icons-arrows";
import { GroupEntryProps } from "./ResultList";
import { Line } from "react-chartjs-2";
import { eachDayOfInterval, parseISO, format } from "date-fns";

function GroupedResultsSummary({ groupsByStrategy }: GroupEntryProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { labels, counts } = useMemo(() => {
        const dateCounts: Record<string, number> = {};

        groupsByStrategy.testRanges.forEach(({ startDate, endDate }: { startDate: string, endDate: string }) => {
            const days = eachDayOfInterval({
                start: parseISO(startDate),
                end: parseISO(endDate),
            });

            for (const day of days) {
                const dateStr = format(day, 'yyyy-MM-dd');
                dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
            }
        });

        const sortedDates = Object.keys(dateCounts).sort();
        return {
            labels: sortedDates,
            counts: sortedDates.map(date => dateCounts[date]),
        };
    }, [groupsByStrategy.testRanges]);

    const dateData = {
        labels,
        datasets: [
            {
                label: 'Active Tests',
                data: counts,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // tailwind sky-500/20
                borderColor: 'rgba(59, 130, 246, 1)',       // tailwind sky-500
                tension: 0.3,
                pointRadius: 0,
            }
        ]
    };

    return (
        <>
            <div className="border-b-2 border-black/30 dark:border-white/30 flex justify-between items-center">
                <div className="font-semibold text-slate-700 dark:text-white pb-1 flex justify-start items-center gap-x-2">
                    <div className="text-sm font-light">strategy</div>
                    <div className="italic text-lg">{groupsByStrategy.results[0]?.strategyName ?? "Unknown"}</div>
                    <div className="font-mono text-sm text-sky-700 dark:text-blue-300">
                        average P/L: {groupsByStrategy.avgPL.toFixed(2)}%
                    </div>
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center space-x-1 bg-slate-50 border-2 border-slate-100 hover:scale-90">
                    <div className="text-xs font-bold tracking-tight">see {isExpanded ? "less" : "more"}</div>
                    {isExpanded ? <UpArrow /> : <DownArrow />}
                </button>
            </div>
            {isExpanded &&
                <div className="rounded-b-lg bg-slate-50 mb-4 p-2 shadow-lg">
                    <div className="lowercase text-xs font-bold overflow-x-clip">
                        symbols tested on: <span className="text-base font-light">{groupsByStrategy.symbols.join(", ").toUpperCase()}</span>
                    </div>
                    <div className="text-sm font-extralight m-1 text-center">
                        <span className="text-xs font-medium">visualization: </span>Date Ranges Tested
                    </div>
                    <Line
                        data={dateData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        maxTicksLimit: 10,
                                        maxRotation: 45,
                                        minRotation: 45,
                                    },
                                },
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: "Active Tests",
                                    },
                                },
                            },
                        }}
                    />
                    <div className="text-xs font-light text-center italic dark:text-white">
                        Consider validating your strategy with results from over a broad range of companies and time periods. Use this graphic to aid in that process.
                    </div>
                </div>
            }
        </>
    );
}

export default GroupedResultsSummary;
