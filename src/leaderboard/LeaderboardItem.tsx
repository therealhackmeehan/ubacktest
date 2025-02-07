import type { Result } from 'wasp/entities';
import { useInView } from 'react-intersection-observer';
import { FiBookOpen } from 'react-icons/fi';
import { useState } from 'react';
import LeaderboardPlot from './LeaderboardPlot';

interface LeaderboardItemProps {
    result: Result;
    index: number;
}

function LeaderboardItem({ result, index }: LeaderboardItemProps) {

    const [leaderboardPlotOpen, setLeaderboardPlotOpen] = useState<boolean>(false);

    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    return (
        <>
            <div
                ref={ref}
                className={`border-l-8 border-sky-700 rounded-md my-2 from-slate-100 to-white p-2 justify-between flex duration-700 shadow-lg`}
                style={{
                    transform: inView ? "translateX(0)" : (((index % 2) === 0) ? `translateX(-${(index + 1) * 10}px)` : `translateX(${(index + 1) * 10}px)`),
                }}
            >
                <div className='text-title-lg font-bold px-3'>
                    {index + 1}
                </div>
                <div className='font-bold text-lg text-end tracking-tight flex justify-end'>
                    <div>@jmeehan</div>
                    <div className='font-light text-xs space-y-2 m-2'>
                        <div className='flex gap-x-4 justify-between p-1 rounded-md bg-slate-100'>Profit/Loss <span className='text-lg text-sky-700 font-extrabold'>{result.profitLoss.toFixed(2)}%</span></div>
                    </div>

                    <button className='px-3 py-1 flex rounded-lg bg-slate-100 hover:shadow-lg items-center gap-x-2'
                        onClick={() => setLeaderboardPlotOpen(true)}>
                        view
                        <FiBookOpen />
                    </button>
                </div>
            </div>

            {leaderboardPlotOpen && <LeaderboardPlot result={result} setLeaderboardPlotOpen={setLeaderboardPlotOpen} index={index + 1} />}
        </>
    )
}

export default LeaderboardItem;