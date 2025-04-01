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
                className={`border-2 md:border-0 md:border-l-8 border-sky-700/50 dark:border-blue-300 rounded-md my-6 md:my-2 bg-white p-2 justify-between md:flex duration-700 dark:bg-black`}
                style={{
                    transform: inView ? `translateX(${10-2*(index+1)})` : (((index % 2) === 0) ? `translateX(-${(index + 1) * 10}px)` : `translateX(${(index + 1) * 10}px)`),
                }}
            >
                <div className='px-3 mt-6 md:mt-0 flex items-center gap-x-3'>
                    <div className='text-title-lg font-bold dark:text-white'>
                        {index + 1}
                    </div>
                    <div className={`py-2 px-4 rounded-xl ${randomColor()} text-white font-extrabold text-xl dark:text-black`}>{result.email.charAt(0).toUpperCase()}</div>
                </div>
                <div className='font-bold text-xs text-end tracking-tight md:flex gap-x-3 justify-end space-y-2 md:space-y-0'>
                    <div className='p-2 m-1 text-sky-700 dark:text-blue-300 text-xl md:text-xs'>@{result.email.split('@')[0]}</div>
                    <div className='flex gap-x-4 justify-between py-1 px-2 rounded-md bg-slate-100 dark:bg-boxdark dark:text-white'>Annualized P/L <span className='text-lg text-sky-700 font-mono dark:text-blue-300'>{result.profitLossAnnualized.toFixed(2)}%</span></div>
                    <div className='flex gap-x-4 justify-between py-1 px-2 rounded-md bg-slate-200 dark:bg-boxdark dark:text-white'>P/L <span className='text-lg text-sky-700 font-mono dark:text-blue-300'>{result.profitLoss.toFixed(2)}%</span></div>

                    <button className='px-3 py-1 w-full md:w-auto flex rounded-md bg-slate-300 justify-self-center hover:shadow-lg items-center gap-x-2 dark:bg-white text-lg md:text-xs'
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