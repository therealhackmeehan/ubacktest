import { useState, useMemo, useRef, useEffect } from "react";
import { DownArrow, UpArrow } from "../../../client/icons/icons-arrows";
import { GroupEntryProps } from "./ResultList";
import { eachDayOfInterval, parseISO, format } from "date-fns";

function GroupedResultsSummary({ groupsByStrategy }: GroupEntryProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [dateToDisplay, setDateToDisplay] = useState<string>("");
    const [hoverX, setHoverX] = useState<number | null>(null);

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

    const heightPerLevel = 10;
    const scaleY = (level: number) => level * heightPerLevel + 20;

    // Define width of the chart area for KDE
    const viewBoxWidth = 1000;
    const resolution = 1; // smaller means more density points per bar, more stair-steppy

    const xPoints: number[] = [];

    stacked.forEach(({ range }) => {
        const start = +parseISO(range.startDate);
        const end = +parseISO(range.endDate);
        const stepCount = Math.ceil((end - start) / (resolution * 1000 * 60 * 60 * 24)); // step per ~5 days (adjust as needed)

        for (let i = 0; i <= stepCount; i++) {
            const t = start + ((end - start) * i) / stepCount;
            const x = ((t - +minDate) / (+maxDate - +minDate)) * viewBoxWidth;
            xPoints.push(x);
        }
    });

    // Step 2: Compute KDE (very basic version)
    const kernel = (u: number) => Math.exp(-0.5 * u * u); // Gaussian
    const bandwidth = 5; // Adjust this for smoothness
    const sampleCount = 200;
    const kdeSamples = Array.from({ length: sampleCount }, (_, i) => {
        const x = (i / (sampleCount - 1)) * viewBoxWidth;
        const density = xPoints.reduce((sum, xi) => {
            return sum + kernel((x - xi) / bandwidth);
        }, 0);
        return { x, y: density };
    });

    // Step 3: Scale density to SVG height
    const maxDensity = Math.max(...kdeSamples.map(p => p.y));
    const kdeBaseY = 102; // start the KDE near the bottom
    const densityHeight = 20; // how tall the curve can be max

    const kdePath = kdeSamples
        .map(({ x, y }, i) => {
            const scaledY = kdeBaseY - (y / maxDensity) * densityHeight;
            return `${i === 0 ? "M" : "L"}${x},${scaledY}`;
        })
        .join(" ");

    const kdePathFilled = kdePath + ` L1000,100 L0,100 Z`;

    const xToDate = (x: number) => {
        const dateValue = (x / viewBoxWidth) * (+maxDate - +minDate) + +minDate;
        return new Date(dateValue);
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
                <div className="rounded-b-xl border-x-2 border-t-4 border-b-2 border-black/30 white:border-white/30 bg-slate-50 mb-4 p-2 shadow-lg">
                    <div className="uppercase text-center text-xs font-bold">
                        tested on: <span className="text-base font-light">{[...new Set(groupsByStrategy.symbols)].join(", ")} <span className="lowercase text-xs">({groupsByStrategy.symbols.length} total tests)</span></span>
                    </div>

                    <div className="flex justify-between m-1">
                        <div className="text-sm font-extralight">
                            <span className="font-bold">Date Range(s)</span> Tested*
                        </div>
                        <div className="rounded-md p-1 bg-slate-200 border-2 border-slate-300">
                            <div className="text-xs italic font-extralight text-slate-700 font-sans">@ {dateToDisplay}</div>
                        </div>
                    </div>

                    <div className="min-h-[20px] max-h-[100px] overflow-y-auto overflow-x-hidden border-x-2 bg-slate-100">
                        <svg width="100%" height="100" viewBox="0 0 1000 100" preserveAspectRatio="none"
                            onMouseMove={(e) => {
                                const boundingRect = e.currentTarget.getBoundingClientRect();
                                const svgX = ((e.clientX - boundingRect.left) / boundingRect.width) * viewBoxWidth;
                                setHoverX(svgX);
                                const date = xToDate(svgX);
                                setDateToDisplay(date.toISOString().split("T")[0]); // or format however you like
                            }}
                            onMouseLeave={() => setDateToDisplay("")}>
                            {stacked.map(({ range, level }, i) => {
                                const x1 = ((+parseISO(range.startDate) - +minDate) / (+maxDate - +minDate)) * 1000;
                                const x2 = ((+parseISO(range.endDate) - +minDate) / (+maxDate - +minDate)) * 1000;
                                const y = scaleY(level); // adjust this too if needed
                                return (
                                    <polyline
                                        className="hover:cursor-pointer hover:hue-rotate-90"
                                        key={i}
                                        points={`${x1},${y} ${x2},${y}`}
                                        stroke="#075985"
                                        strokeWidth="8"
                                        strokeLinecap="butt"

                                    />
                                );
                            })}
                            <path
                                d={kdePathFilled}
                                fill="#0ea5e9" // tailwind sky-400
                                opacity="0.2"
                            />
                            <path
                                d={kdePath}
                                fill="none"
                                stroke="#0284c7" // tailwind sky-600
                                strokeWidth="2"
                                opacity="0.8"
                            />
                            {hoverX !== null && (
                                <line
                                    x1={hoverX}
                                    x2={hoverX}
                                    y1={0}
                                    y2={100}
                                    stroke="black"
                                    strokeDasharray="2"
                                    strokeWidth={1}
                                    pointerEvents="none" // So it doesn't block hover
                                />
                            )}
                        </svg>
                    </div>
                    {/* Axis date labels */}
                    <div className="h-1 border-x-2 border-t-2"></div>
                    <div className="text-xs flex justify-between font-mono text-slate-600 dark:text-slate-300 pt-1">
                        <div>{format(minDate, "yyyy-MM-dd")}</div>
                        <div>{format(maxDate, "yyyy-MM-dd")}</div>
                    </div>

                    <div className="text-xs font-light text-end italic dark:text-white mt-2">
                        *Consider validating your strategy with results from over a broad range of companies and time periods. Use this graphic to aid in that process.
                    </div>
                </div>
            }
        </>
    );
}

export default GroupedResultsSummary;
