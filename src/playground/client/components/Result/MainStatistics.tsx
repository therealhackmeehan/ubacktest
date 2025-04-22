import { StatProps } from "../../../../shared/sharedTypes";

function MainStatistics({ stats }: { stats: StatProps }) {
    return (
        <div className="p-4 col-span-1 bg-slate-100 rounded-lg shadow-sm">
            <div className="font-extrabold mb-2 text-xl text-start tracking-tight p-2 rounded-lg bg-white">
                Stats
            </div>
            <Stat text="# of timepoints" stat={stats.length} />
            <Stat text="profit/loss" stat={stats.pl} digits={2} suffix="%" />
            {stats.pl !== stats.plWCosts && (
                <Stat text="profit/loss (w/ trading costs)" stat={stats.plWCosts} digits={2} suffix="%" />
            )}
            <Stat text="CAGR" stat={stats.cagr} digits={2} suffix="%" />
            <Stat text="number of trades" stat={stats.numTrades} />
            <Stat text="number of profitable trades" stat={stats.numProfTrades} />
            <Stat text="% trades profitable" stat={stats.percTradesProf} digits={2} suffix="%" />
            <Stat text="max drawdown" stat={stats.maxDrawdown} digits={2} suffix="%" />
            <Stat text="max gain" stat={stats.maxGain} digits={2} suffix="%" />
            <br />
            <Stat text="sharpe ratio" stat={stats.sharpeRatio} digits={3} />
            <Stat text="sortino ratio" stat={stats.sortinoRatio} digits={3} />
        </div>
    );
}

interface StatItemProps {
    text: string;
    stat: number | string | null | undefined;
    digits?: number;
    suffix?: string;
}

function Stat({ text, stat, digits, suffix }: StatItemProps) {
    const isNumber = typeof stat === "number" && !isNaN(stat);

    const formattedStat = isNumber
        ? stat.toFixed(digits ?? 0) + (suffix ?? "")
        : stat ?? "-";

    return (
        <div className="p-1 flex justify-between text-xs">
            <div className="font-light">{text}</div>
            <div className="font-bold tracking-tight">{formattedStat}</div>
        </div>
    );
}

export default MainStatistics;
