import { useInView } from 'react-intersection-observer';
import { FiBookOpen } from 'react-icons/fi';
import { useState } from 'react';
import LeaderboardPlot from './LeaderboardPlot';
import { ResultWithUsername } from '../playground/server/resultOperations';
import { randomColor } from './LeaderboardPage';

interface LeaderboardItemProps {
    result: ResultWithUsername;
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
                className={`border-l-8 border-sky-700 rounded-md my-2 bg-white p-2 justify-between flex duration-700`}
                style={{
                    transform: inView ? "translateX(0)" : (((index % 2) === 0) ? `translateX(-${(index + 1) * 10}px)` : `translateX(${(index + 1) * 10}px)`),
                }}
            >
                <div className='px-3 flex items-center gap-x-3'>
                    <div className='text-title-lg font-bold'>
                        {index + 1}
                    </div>
                    <div className={`py-2 px-4 rounded-xl ${randomColor()} text-white font-extrabold text-xl`}>{result.email.charAt(0).toUpperCase()}</div>
                </div>
                <div className='font-bold text-xs text-end tracking-tight flex gap-x-3 justify-end'>
                    <div className='p-2 m-1 text-sky-700'>@{result.email.split('@')[0]}</div>
                    <div className='flex gap-x-4 justify-between py-1 px-2 rounded-md bg-slate-100'>Annualized P/L <span className='text-lg text-sky-700 font-mono'>{result.profitLossAnnualized.toFixed(2)}%</span></div>
                    <div className='flex gap-x-4 justify-between py-1 px-2 mdrounded-md bg-slate-200'>P/L <span className='text-lg text-sky-700 font-mono'>{result.profitLoss.toFixed(2)}%</span></div>

                    <button className='px-3 py-1 flex rounded-md bg-slate-300 justify-self-center hover:shadow-lg items-center gap-x-2'
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