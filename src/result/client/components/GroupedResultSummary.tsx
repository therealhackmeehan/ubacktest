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

    const { stacked, minDate, maxDate, averageProfitLoss, annualizedProfitLoss, xPoints, symbols } = useMemo(() => {
        const parse = (str: string) => parseISO(str);

        const allResults = Object.values(resultsByStrategy).flat();
        const allRanges = allResults
            .map(result => ({
                ...result,
                start: parse((result.formInputs as unknown as FormInputProps).startDate),
                end: parse((result.formInputs as unknown as FormInputProps).endDate),
            }))
            .sort((a, b) => +a.start - +b.start);

        const levels: { range: typeof allRanges[0]; level: number }[] = [];

        allRanges.forEach(range => {
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

        let min: Date | null = null;
        let max: Date | null = null;
        allResults.forEach(result => {
            const start = parse((result.formInputs as unknown as FormInputProps).startDate);
            const end = parse((result.formInputs as unknown as FormInputProps).endDate);
            if (!min || start < min) min = start;
            if (!max || end > max) max = end;
        });

        const totalProfitLoss = allResults.reduce(
            (sum, r) => sum + (r.profitLoss ?? 0),
            0
        );
        const avgProfitLoss = allResults.length > 0 ? totalProfitLoss / allResults.length : 0;

        const totalProfitLossAnnualized = allResults.reduce(
            (sum, r) => sum + (r.profitLossAnnualized ?? 0),
            0
        );
        const avgProfitLossAnnualized = allResults.length > 0 ? totalProfitLossAnnualized / allResults.length : 0;

        const viewBoxWidth = 1000;
        const resolution = 1;
        const xPts: number[] = [];

        levels.forEach(({ range }) => {
            const start = +range.start;
            const end = +range.end;
            const steps = Math.ceil((end - start) / (resolution * 1000 * 60 * 60 * 24));
            for (let i = 0; i <= steps; i++) {
                const t = start + ((end - start) * i) / steps;
                const x = ((t - +min!) / (+max! - +min!)) * viewBoxWidth;
                xPts.push(x);
            }
        });

        const symbols = [
            ...new Set(
                Object.values(resultsByStrategy)
                    .flat()
                    .map(result => (result.formInputs as unknown as FormInputProps).symbol)
            ),
        ];

        return {
            stacked: levels,
            minDate: min!,
            maxDate: max!,
            averageProfitLoss: avgProfitLoss,
            annualizedProfitLoss: avgProfitLossAnnualized,
            xPoints: xPts,
            symbols: symbols,
        };

    }, [resultsByStrategy]);

    const getYearTicks = () => {
        const years = [];
        let currentYear = new Date(minDate).getFullYear();
        const endYear = new Date(maxDate).getFullYear();

        while (currentYear <= endYear) {
            years.push(new Date(currentYear, 0, 1)); // Add January 1st of each year
            currentYear++;
        }
        return years;
    };

    const heightPerLevel = 10;
    const bandwidth = 5;

    const scaleY = (level: number) => level * heightPerLevel + 2 * bandwidth;
    const viewBoxWidth = 1000;
    const sampleCount = 200;

    const densityHeight = 17;
    const kdeBaseY = 20;

    const kernel = (u: number) => Math.exp(-0.5 * u * u);
    const kdeSamples = Array.from({ length: sampleCount }, (_, i) => {
        const x = (i / (sampleCount - 1)) * viewBoxWidth;
        const density = xPoints.reduce((sum, xi) => sum + kernel((x - xi) / bandwidth), 0);
        return { x, y: density };
    });

    const maxDensity = Math.max(...kdeSamples.map(p => p.y));
    const kdePath = kdeSamples
        .map(({ x, y }, i) => {
            const scaledY = kdeBaseY - (y / maxDensity) * densityHeight;
            return `${i === 0 ? "M" : "L"}${x},${scaledY}`;
        })
        .join(" ");
    const kdePathFilled = `${kdePath} L1000,100 L0,100 Z`;

    const xToDate = (x: number) => new Date((x / viewBoxWidth) * (+maxDate - +minDate) + +minDate);
    const dateToX = (date: Date) => {
        return ((+date - +minDate) / (+maxDate - +minDate)) * viewBoxWidth;
    };

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
                    {/* <div className="text-xs font-mono text-sky-700 dark:text-white">
                        (avg annualized P/L: {annualizedProfitLoss.toFixed(2)}%)
                    </div> */}
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

                    {/* <div className="uppercase text-center text-xs font-bold">
                        tested on: <span className="text-base font-light">{symbols.join(", ")} <span className="lowercase text-xs">({symbols.length} total tests)</span></span>
                    </div> */}

                    <div className="flex justify-between m-1">
                        <div className="text-sm font-extralight">
                            Where have I backtested
                            <span className="font-bold text-lg"> {resultsByStrategy[0]?.strategyName ?? "Unknown"}</span> ?
                        </div>
                        <div className="rounded-md p-1 bg-slate-200 border-2 border-slate-300">
                            <div className="text-xs italic font-extralight text-slate-700 font-sans">
                                {tickerToDisplay} @ {dateToDisplay}
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '100px', overflowY: 'scroll' }} className="bg-white">
                        <svg
                            width="100%"
                            viewBox="0 0 1000 130"
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
                            {stacked.map(({ range, level }, i) => {
                                const x1 = ((+range.start - +minDate) / (+maxDate - +minDate)) * viewBoxWidth;
                                const x2 = ((+range.end - +minDate) / (+maxDate - +minDate)) * viewBoxWidth;
                                const y = scaleY(level);
                                return (
                                    <polyline
                                        key={i}
                                        points={`${x1},${y} ${x2},${y}`}
                                        stroke={range.profitLoss > 0 ? "#047857" : "#b91c1c"}
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
                                    y2={130} // Ensure this line spans the full height of the SVG container
                                    stroke="black"
                                    strokeDasharray="2"
                                    strokeWidth={1}
                                    pointerEvents="none"
                                />
                            )}
                        </svg>
                    </div>

                    <svg
                        width="100%"
                        viewBox="0 0 1000 20"
                        preserveAspectRatio="none">
                        <path d={kdePathFilled} fill="#0ea5e9" opacity="0.2" />
                        <path d={kdePath} stroke="#0284c7" strokeWidth="2" fill="none" opacity="0.8" />
                    </svg>

                    <svg
                        width="100%"
                        viewBox="0 0 1000 20"
                        preserveAspectRatio="none">
                        {/* Render Year Ticks */}
                        {getYearTicks().map((yearDate, index) => {
                            const x = dateToX(yearDate);
                            return (
                                <g key={index}>
                                    <line
                                        x1={x}
                                        x2={x}
                                        y1={0}
                                        y2={6} // Small line to indicate the tick
                                        stroke="black"
                                        strokeWidth="2"
                                    />
                                    <text
                                        x={x}
                                        y={16} // Position the text below the tick
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="black"
                                    >
                                        {format(yearDate, 'yyyy')}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* <div className="h-1 border-x-2 border-t-2"></div>
                    <div className="text-xs flex justify-between font-mono text-slate-600 pt-1">
                        <div>{format(minDate, "yyyy-MM-dd")}</div>
                        <div>{format(maxDate, "yyyy-MM-dd")}</div>
                    </div> */}

                    <div className="text-xs font-light text-end italic mt-2">
                        Each line corresponds to a backtest result for this strategy, listed below. Hover over a line to display the specific strategy details. Green lines = profitable backtests, while red lines = losses.
                    </div>
                </div>
            )}
        </>
    );
}

export default GroupedResultsSummary;
