import type { Result } from 'wasp/entities';
import { useInView } from 'react-intersection-observer';
import { FiBookOpen } from 'react-icons/fi';
import { useState } from 'react';

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
                className={`rounded-md ${index < 3 ? "max-w-3xl bg-gradient-to-tl" : "max-w-2xl bg-gradient-to-bl"} my-4 mx-auto from-slate-100 to-white p-2 justify-between flex duration-700 shadow-sm`}
                style={{
                    transform: inView ? "translateX(0)" : `translateX(-${index * 20}px)`,
                }}
            >
                <div className='text-title-lg font-bold px-3'>
                    {index + 1}
                </div>
                <div className='font-bold text-lg text-end tracking-tight flex justify-end'>
                    <div>
                        P/L <div>{result.profitLoss}</div>
                        Annual P/L <div>{result.profitLossAnnualized}</div>
                    </div>

                    <button className='px-3 py-1 flex rounded-lg bg-white hover:shadow-lg items-center gap-x-2'
                        onClick={() => setLeaderboardPlotOpen(true)}>
                        view
                        <FiBookOpen />
                    </button>
                </div>
            </div>

            {leaderboardPlotOpen && <div>hi</div>}
        </>
    )
}

export default LeaderboardItem;