import { StatProps } from "../../../../shared/sharedTypes";

function MainStatistics({ stats }: { stats: StatProps }) {

    return (
        <div className="p-4 col-span-1 bg-slate-100 rounded-lg shadow-sm">
            <div className='font-extrabold mb-2 text-xl text-start tracking-tight p-2 rounded-lg bg-white'>
                Stats
            </div>
            <Stat text={'# of timepoints'} stat={stats.length} />
            <Stat text={'profit/loss'} stat={stats.pl?.toFixed(2) + "%"} />
            {(stats.pl !== stats.plWCosts) && <Stat text={'profit/loss (w/ trading costs)'} stat={stats.plWCosts?.toFixed(2) + "%"} />}
            <Stat text={'CAGR'} stat={stats.cagr?.toFixed(2) + "%"} />
            <Stat text={'number of trades'} stat={stats.numTrades} />
            <Stat text={'number of profitable trades'} stat={stats.numProfTrades} />
            <Stat text={'% trades profitable'} stat={stats.percTradesProf?.toFixed(2) + "%"} />
            <Stat text={'max drawdown'} stat={stats.maxDrawdown?.toFixed(2) + "%"} />
            <Stat text={'max gain'} stat={stats.maxGain?.toFixed(2) + "%"} />
            <br></br>
            <Stat text={'sharpe ratio'} stat={stats.sharpeRatio?.toFixed(3)} />
            <Stat text={'sortino ratio'} stat={stats.sortinoRatio?.toFixed(3)} />
        </div>
    )
}

interface StatItemProps {
    text: string;
    stat: number | string | null | undefined;
}

function Stat({ text, stat }: StatItemProps) {

    return (
        <div className="p-1 flex justify-between text-xs">
            <div className="font-light">
                {text}
            </div>

            <div className="font-bold tracking-tight">
                {stat !== null && !Number.isNaN(stat) ? stat : "-"}
            </div>
        </div>
    )
}

export default MainStatistics;
