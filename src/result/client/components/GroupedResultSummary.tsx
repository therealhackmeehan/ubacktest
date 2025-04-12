import { useState, useMemo } from "react";
import { DownArrow, UpArrow } from "../../../client/icons/icons-arrows";
import { parseISO, format, setDate } from "date-fns";
import { FormInputProps } from "../../../shared/sharedTypes";
import { ResultWithStrategyName } from "wasp/src/playground/server/resultOperations";

interface GroupedResultsProps {
    resultsByStrategy: ResultWithStrategyName[];
    setResultToHighlight: (val: string) => void;
}

function GroupedResultsSummary({ resultsByStrategy, setResultToHighlight }: GroupedResultsProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [dateToDisplay, setDateToDisplay] = useState<string>("");
    const [tickerToDisplay, setTickerToDisplay] = useState<string>("")
    const [hoverX, setHoverX] = useState<number | null>(null);

    // constants and one-liners
    const viewBoxWidth = 1000;
    const sampleCount = 200;
    const bandwidth = 5;
    const densityHeight = 17;
    const kdeBaseY = 20;
    const heightPerLevel = 10;
    const xToDate = (x: number) => new Date((x / viewBoxWidth) * (+maxDate - +minDate) + +minDate);
    const scaleY = (level: number) => level * heightPerLevel + 2 * bandwidth;

    // memoized KDE and SVG actions

    const parsedResults = useMemo(() => {
        const parse = (str: string) => parseISO(str);
        return resultsByStrategy.map(result => ({
            ...result,
            start: parse((result.formInputs as unknown as FormInputProps).startDate),
            end: parse((result.formInputs as unknown as FormInputProps).endDate),
        }));
    }, [resultsByStrategy]);

    const stackedLevels = useMemo(() => {
        const levels: { range: typeof parsedResults[0]; level: number }[] = [];

        parsedResults.forEach(range => {
            let level = 0;
            while (
                levels.some(
                    l =>
                        l.level === level &&
                        l.range.end > range.start &&
                        l.range.start < range.end
                )
            ) {
                level++;
            }
            levels.push({ range, level });
        });

        return levels;
    }, [parsedResults]);

    const { minDate, maxDate } = useMemo(() => {
        let min: Date | null = null;
        let max: Date | null = null;

        parsedResults.forEach(result => {
            if (!min || result.start < min) min = result.start;
            if (!max || result.end > max) max = result.end;
        });

        return { minDate: min!, maxDate: max! };
    }, [parsedResults]);

    const { averageProfitLoss, averageCagr, averageTimepoints } = useMemo(() => {
        const total = (arr: typeof parsedResults, key: keyof ResultWithStrategyName) =>
            arr.reduce((sum, r) => sum + ((r[key] as number) ?? 0), 0);

        const count = parsedResults.length;
        return {
            averageProfitLoss: count ? total(parsedResults, 'pl') / count : 0,
            averageCagr: count ? total(parsedResults, 'cagr') / count : 0,
            averageTimepoints: count ? total(parsedResults, 'length') / count : 0,
        };
    }, [parsedResults]);

    const xPoints = useMemo(() => {
        const viewBoxWidth = 1000;
        const resolution = 1;
        const pts: number[] = [];

        stackedLevels.forEach(({ range }) => {
            const start = +range.start;
            const end = +range.end;
            const steps = Math.ceil((end - start) / (resolution * 1000 * 60 * 60 * 24));
            for (let i = 0; i <= steps; i++) {
                const t = start + ((end - start) * i) / steps;
                const x = ((t - +minDate) / (+maxDate - +minDate)) * viewBoxWidth;
                pts.push(x);
            }
        });

        return pts;
    }, [stackedLevels, minDate, maxDate]);

    const { kdeSamples, kdePath, kdePathFilled } = useMemo(() => {
        const kernel = (u: number) => Math.exp(-0.5 * u * u);

        const samples = Array.from({ length: sampleCount }, (_, i) => {
            const x = (i / (sampleCount - 1)) * viewBoxWidth;
            const density = xPoints.reduce((sum, xi) => sum + kernel((x - xi) / bandwidth), 0);
            return { x, y: density };
        });

        const maxDensity = Math.max(...samples.map(p => p.y));

        const path = samples
            .map(({ x, y }, i) => {
                const scaledY = kdeBaseY - (y / maxDensity) * densityHeight;
                return `${i === 0 ? "M" : "L"}${x},${scaledY}`;
            })
            .join(" ");

        const pathFilled = `${path} L1000,100 L0,100 Z`;

        return { kdeSamples: samples, kdePath: path, kdePathFilled: pathFilled };
    }, [xPoints]);

    return (
        <>
            <div className="border-b-2 border-black/30 dark:border-white/30 flex justify-between items-center">
                <div className="font-semibold text-slate-700 dark:text-white pb-1 flex justify-start items-center gap-x-2">
                    <div className="text-sm font-light">strategy</div>
                    <div className="italic text-xl">
                        {resultsByStrategy[0]?.strategyName ?? "Unknown"}
                    </div>
                    <div className="text-sm font-mono text-sky-700 dark:text-blue-300">
                        avg P/L: {averageProfitLoss.toFixed(2)}%
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    disabled={resultsByStrategy.length <= 1} // Disable the button when the length is <= 1
                    className={`flex items-center space-x-1 bg-slate-50 border-2 border-slate-100 hover:scale-90 ${resultsByStrategy.length <= 1 ? "cursor-not-allowed opacity-50" : ""
                        }`}
                >
                    <div className="text-xs font-bold tracking-tight">
                        see {isExpanded ? "less" : "more"}
                    </div>
                    {isExpanded ? <UpArrow /> : <DownArrow />}
                </button>

            </div>

            {isExpanded && (
                <div className="rounded-b-xl border-x-2 border-t-4 border-b-2 border-black/30 dark:border-white/30 bg-slate-50 mb-4 p-2 shadow-lg">
                    <div className="text-end flex justify-around text-sm mb-2 py-2 border-b-2 border-slate-300">
                        <div>
                            Average P/L: <span className="font-bold">{averageProfitLoss.toFixed(2)}%</span>
                        </div>
                        <div>
                            Average Annualized P/L: <span className="font-bold">{averageCagr.toFixed(2)}%</span>
                        </div>
                        <div>
                            Average # of Timepoints: <span className="font-bold">{averageTimepoints.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between m-1">
                        <div className="text-sm font-extralight">
                            Where have I backtested <span className="font-bold text-lg"> {resultsByStrategy[0]?.strategyName ?? "Unknown"}</span> ?
                        </div>
                        <div className="rounded-md p-1 bg-slate-200 border-2 border-slate-300">
                            <div className="text-xs italic font-extralight text-slate-700 font-sans">
                                <span className="font-bold">{tickerToDisplay}</span> @ {dateToDisplay}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-120 overflow-y-auto border-2 border-slate-200">
                        <svg
                            width="100%"
                            viewBox={`0 0 1000 ${Math.max(stackedLevels.length * heightPerLevel, 100)}`}
                            preserveAspectRatio="none"
                            onMouseMove={(e) => {
                                const bounds = e.currentTarget.getBoundingClientRect();
                                const svgX = ((e.clientX - bounds.left) / bounds.width) * viewBoxWidth;
                                setHoverX(svgX);
                                setDateToDisplay(format(xToDate(svgX), "yyyy-MM-dd"));
                            }}
                            onMouseLeave={() => {
                                setDateToDisplay("");
                                setHoverX(null);
                            }}
                        >
                            {stackedLevels.map(({ range, level }, i) => {
                                const x1 = ((+range.start - +minDate) / (+maxDate - +minDate)) * viewBoxWidth;
                                const x2 = ((+range.end - +minDate) / (+maxDate - +minDate)) * viewBoxWidth;
                                const y = scaleY(level);
                                return (
                                    <polyline
                                        key={i}
                                        points={`${x1},${y} ${x2},${y}`}
                                        stroke={(range.pl && range.pl > 0) ? "#047857" : "#b91c1c"}
                                        strokeWidth="8"
                                        strokeLinecap="butt"
                                        className="hover:cursor-pointer hover:hue-rotate-15"
                                        onMouseEnter={() => {
                                            setResultToHighlight(range.id);
                                            setTickerToDisplay((range.formInputs as unknown as FormInputProps).symbol.toUpperCase())
                                        }}
                                        onMouseLeave={() => {
                                            setResultToHighlight('');
                                            setTickerToDisplay("");
                                        }}
                                    />
                                );
                            })}

                            {hoverX !== null && (
                                <line
                                    x1={hoverX}
                                    x2={hoverX}
                                    y1={0}
                                    y2={Math.max(stackedLevels.length * heightPerLevel, 100)} // Ensure this line spans the full height of the SVG container
                                    stroke="black"
                                    strokeDasharray="2"
                                    strokeWidth={1}
                                    pointerEvents="none"
                                />
                            )}
                        </svg>
                    </div>

                    <svg
                        className="border-x-2 border-slate-200"
                        width="100%"
                        viewBox="0 0 1000 20"
                        preserveAspectRatio="none">
                        <path d={kdePathFilled} fill="#0ea5e9" opacity="0.2" />
                        <path d={kdePath} stroke="#0284c7" strokeWidth="2" fill="none" opacity="0.8" />
                    </svg>
                    <div className="h-2 border-x-2 border-t-2"></div>
                    <div className="text-xs flex justify-between text-slate-600 pt-1">
                        <div>{format(minDate, "yyyy-MM-dd")}</div>
                        <div>{format(maxDate, "yyyy-MM-dd")}</div>
                    </div>

                    <div className="text-xs font-light text-end italic mt-2">
                        Each line corresponds to a backtest result for this strategy, listed below. Hover over a line to display the specific strategy details. Green lines = profitable backtests, while red lines = losses.
                    </div>
                </div>
            )}
        </>
    );
}

export default GroupedResultsSummary;
