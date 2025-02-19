import SmallPlot from "./SmallPlot";
import { StrategyResultProps } from '../../../shared/sharedTypes';
import { type Result } from 'wasp/entities';

interface ResultHeaderProps {
    result: Result;
    setResultPanelOpen: (val: boolean) => void;

}
function ResultHeader({ result, setResultPanelOpen }: ResultHeaderProps) {
    return (
        <div className='flex justify-between gap-x-3 mb-3 md:mb-0'>
            <button className='tracking-tight md:text-xl font-semibold hover:text-sky-700 dark:text-white' onClick={() => setResultPanelOpen(true)}>
                {result.name}
            </button>
            <div className='text-xs border-l-2 border-black/40 px-2 bg-white dark:bg-boxdark-2 dark:text-white'>
                profit/loss: <span className='md:text-lg'>{result.profitLoss.toFixed(2)}%</span>
            </div>
            {result.data ?
                <div className='p-1 dark:brightness-200 hidden md:flex'>
                    <SmallPlot data={result.data as unknown as StrategyResultProps} />
                </div>
                :
                // for really large strategies, data is not stored but the api is called if clicked on.
                <div className='text-xs tracking-tight p-1 font-extralight lowercase'>Open to view plot.</div>
            }
        </div>
    )
}

export default ResultHeader;