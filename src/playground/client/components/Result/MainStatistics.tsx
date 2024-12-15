import { StatProps } from "../../scripts/calculateStats";

export default function MainStatistics({ stats }: { stats: StatProps }) {

    return (
        <div className="p-8 border-r-2 border-black col-span-1 bg-slate-100">
            <div className='font-extrabold mb-2 text-xl text-start tracking-tight p-2 rounded-lg border-black border-2 bg-white'>
                Stats
            </div>
            <Stat text={'profit/loss'} stat={stats.pl} />
            <Stat text={'approx. annualized profit/loss'} stat={stats.annualizedPl} />
            <Stat text={'number of trades'} stat={stats.numTrades} />
            <Stat text={'number of profitable trades'} stat={stats.numProfTrades} />
            <Stat text={'% trades profitable'} stat={stats.percTradesProfit} />
            <Stat text={'sharpe ratio'} stat={stats.sharpeRatio} />
            <Stat text={'sortino ratio'} stat={stats.sortinoRatio} />
            <Stat text={'max drawdown'} stat={stats.maxDrawdown} />
            <Stat text={'max gain'} stat={stats.maxGain} />
        </div>
    )
}

interface StatItemProps {
    text: string;
    stat: number | string | null;
}
function Stat({ text, stat }: StatItemProps) {

    return (
        <div className="p-1 flex justify-between">
            <div className="text-xs font-light">
                {text}
            </div>

            <div className="font-bold tracking-tight text-sm">
                {stat !== null ? stat : "na"}
            </div>
        </div>
    )
}
