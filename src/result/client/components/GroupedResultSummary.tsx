import { useState, useMemo, useRef, useEffect } from "react";
import { DownArrow, UpArrow } from "../../../client/icons/icons-arrows";
import { GroupEntryProps } from "./ResultList";
import { eachDayOfInterval, parseISO, format } from "date-fns";

function GroupedResultsSummary({ groupsByStrategy }: GroupEntryProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [dateToDisplay, setDateToDisplay] = useState<string>("");

    // Stack overlapping date ranges into levels
    const stacked = useMemo(() => {
        const parse = (str: string) => parseISO(str);
        const sorted = [...groupsByStrategy.testRanges].sort(
            (a, b) => +parse(a.startDate) - +parse(b.startDate)
        );

        const levels: { range: typeof sorted[0]; level: number }[] = [];

        sorted.forEach(range => {
            const start = parse(range.startDate);
            const end = parse(range.endDate);
            let level = 0;

            while (true) {
                const overlapping = levels.some(
                    l =>
                        l.level === level &&
                        parse(l.range.endDate) > start &&
                        parse(l.range.startDate) < end
                );
                if (!overlapping) break;
                level++;
            }

            levels.push({ range, level });
        });

        return levels;
    }, [groupsByStrategy.testRanges]);

    // Define X/Y scale
    const minDate = useMemo(() =>
        groupsByStrategy.testRanges.reduce(
            (min, r) => parseISO(r.startDate) < min ? parseISO(r.startDate) : min,
            parseISO(groupsByStrategy.testRanges[0]?.startDate)
        ), [groupsByStrategy.testRanges]);

    const maxDate = useMemo(() =>
        groupsByStrategy.testRanges.reduce(
            (max, r) => parseISO(r.endDate) > max ? parseISO(r.endDate) : max,
            parseISO(groupsByStrategy.testRanges[0]?.endDate)
        ), [groupsByStrategy.testRanges]);

    const chartHeight = 60;
    const chartWidth = 800;
    const heightPerLevel = 10;

    const scaleX = (date: Date) =>
        ((+date - +minDate) / (+maxDate - +minDate)) * chartWidth;

    const scaleY = (level: number) => level * heightPerLevel + 20;

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
                <div className="rounded-b-lg bg-slate-50 mb-4 p-2 shadow-lg max-h-100 overflow-auto">
                    <div className="lowercase text-xs font-bold overflow-x-clip">
                        symbols tested on: <span className="text-base font-light">{groupsByStrategy.symbols.join(", ").toUpperCase()}</span>
                    </div>

                    <div className="text-sm font-extralight m-1 text-center">
                        <span className="text-xs font-medium">visualization: </span>Date Ranges Tested
                    </div>

                    <svg width={chartWidth} height={chartHeight}>
                        {/* Test bars */}
                        {stacked.map(({ range, level }, i) => {
                            const x1 = scaleX(parseISO(range.startDate));
                            const x2 = scaleX(parseISO(range.endDate));
                            const y = scaleY(level);
                            return (
                                <polyline
                                    onMouseEnter={() => setDateToDisplay("~ " + range.startDate + " to " + range.endDate + " ~")}
                                    onMouseLeave={() => setDateToDisplay("")}
                                    className="hover:cursor-pointer"
                                    key={i}
                                    points={`${x1},${y} ${x2},${y}`}
                                    stroke="#075985"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>
                    

                    {/* Axis date labels */}
                    <div className="text-xs flex justify-between font-mono text-slate-600 dark:text-slate-300 border-t-2 border-slate-300 pt-1">
                        <div>{format(minDate, "yyyy-MM-dd")}</div>
                        {dateToDisplay && <div className="text-xs italic font-extralight text-slate-700 font-sans">{dateToDisplay}</div>}
                        <div>{format(maxDate, "yyyy-MM-dd")}</div>
                    </div>

                    <div className="text-xs font-light text-end italic dark:text-white mt-2">
                        Consider validating your strategy with results from over a broad range of companies and time periods. Use this graphic to aid in that process.
                    </div>
                </div>
            }
        </>
    );
}

export default GroupedResultsSummary;
