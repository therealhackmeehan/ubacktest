import CandlePlot from "../playground/client/components/result/CandlePlot";
import { Result } from "wasp/entities";
import { FormInputProps, StrategyResultProps } from "../shared/sharedTypes";
import { MdExitToApp } from "react-icons/md";

interface LeaderboardPlotProps {
    result: Result,
    setLeaderboardPlotOpen: (value: boolean) => void;
    index: number;
}
function LeaderboardPlot({ result, setLeaderboardPlotOpen, index }: LeaderboardPlotProps) {

    const formInputsLocal = result.formInputs as unknown as FormInputProps;

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-50">
            <div className="fixed inset-0 w-full bg-black/70"></div>
            <div className="relative z-10 w-11/12 p-4 bg-white border-2 border-black rounded-lg shadow-xl overflow-y-auto">
                <div className="flex justify-between m-2 p-4 bg-gradient-to-r from-sky-700 to-white shadow-lg rounded-md">
                    <div className="font-extrabold text-slate-100 text-xl tracking-tight">
                        Strategy Overview <span className="text-xs p-2 bg-slate-700 text-white italic font-extralight mx-4 rounded-full">hypothetical growth of $1</span>
                    </div>
                    <div className="flex gap-x-4 items-end">
                        <div>
                            Rank: <span className='bg-sky-700 text-white rounded-lg py-1 px-2 m-1'>{index}</span>
                        </div>
                        <div>
                            P/L: <span className='bg-sky-700 text-white rounded-lg p-1 m-1'>{result.profitLoss.toFixed(2)}%</span>
                        </div>
                        <div>
                            Annualized P/L: <span className='bg-sky-700 text-white rounded-lg p-1 m-1'>{result.profitLossAnnualized.toFixed(2)}%</span>
                        </div>
                        <button className="text-red-500 hover:-rotate-90 duration-700" onClick={() => setLeaderboardPlotOpen(false)}>
                            <MdExitToApp size="1.5rem" />
                        </button>
                    </div>
                </div>
                <CandlePlot strategyResult={result.data as unknown as StrategyResultProps}
                    costPerTrade={formInputsLocal.costPerTrade}
                    minDate={formInputsLocal.useWarmupDate ? formInputsLocal.warmupDate : formInputsLocal.startDate}
                    symbol={formInputsLocal.symbol} />
            </div>
        </div>
    )
}

export default LeaderboardPlot;