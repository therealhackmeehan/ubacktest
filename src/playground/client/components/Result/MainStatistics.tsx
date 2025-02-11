import { StatProps } from "../../scripts/calculateStats";

function MainStatistics({ stats }: { stats: StatProps }) {

    return (
        <div className="p-4 col-span-1 bg-slate-100 rounded-lg shadow-sm">
            <div className='font-extrabold mb-2 text-xl text-start tracking-tight p-2 rounded-lg bg-white'>
                Stats
            </div>
            <Stat text={'# of timepoints'} stat={stats.length} />
            <Stat text={'profit/loss'} stat={stats.pl} />
            {(stats.pl !== stats.plWCosts) && <Stat text={'profit/loss (w/ trading costs)'} stat={stats.plWCosts} />}
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
        <div className="p-1 flex justify-between text-xs">
            <div className="font-light">
                {text}
            </div>

            <div className="font-bold tracking-tight">
                {stat !== null ? stat : "na"}
            </div>
        </div>
    )
}

export default MainStatistics;
