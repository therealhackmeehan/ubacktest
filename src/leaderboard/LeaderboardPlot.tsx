import CandlePlot from "../playground/client/components/result/CandlePlot";
import { Result } from "wasp/entities";
import { eodFreqs, FormInputProps, StrategyResultProps, UserDefinedData } from "../shared/sharedTypes";
import { ImCancelCircle } from "react-icons/im";

interface LeaderboardPlotProps {
    result: Result,
    setLeaderboardPlotOpen: (value: boolean) => void;
    index: number;
}
function LeaderboardPlot({ result, setLeaderboardPlotOpen, index }: LeaderboardPlotProps) {

    const formInputsLocal = result.formInputs as unknown as FormInputProps;

    const joinedInfo: StrategyResultProps = {
        timestamp: result.timestamp,
        open: result.open,
        close: result.close,
        high: result.high,
        low: result.low,
        volume: result.volume,

        signal: result.signal,
        returns: result.returns,

        sp: result.sp,

        portfolio: result.portfolio,
        portfolioWithCosts: result.portfolioWithCosts,

        cash: result.cash,
        equity: result.equity,

        cashWithCosts: result.cashWithCosts,
        equityWithCosts: result.equityWithCosts,

        userDefinedData: result.userDefinedData as unknown as UserDefinedData,
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-50">
            <div className="fixed inset-0 w-full bg-black/70" onClick={() => setLeaderboardPlotOpen(false)}></div>
            <div className="relative z-10 w-11/12 p-4 m-8 bg-white border-2 border-black rounded-lg shadow-xl overflow-y-auto">
                <div className="min-w-187.5">
                    <div className="flex justify-between m-2 p-4 bg-gradient-to-r from-sky-700 to-white shadow-lg rounded-md">
                        <div className="font-extrabold text-slate-100 text-sm md:text-xl tracking-tight flex">
                            Strategy Overview <span className="hidden lg:flex text-xs p-2 bg-slate-700 text-white italic font-extralight mx-4 rounded-full">hypothetical growth of $1</span>
                        </div>
                        <div className="flex gap-x-4 items-end text-sm md:text-base">
                            <div>
                                Rank: <span className='bg-sky-700 text-white rounded-lg py-1 px-2 m-1'>{index}</span>
                            </div>
                            <div>
                                P/L: <span className='bg-sky-700 text-white rounded-lg p-1 m-1'>{result.pl?.toFixed(2)}%</span>
                            </div>
                            <div>
                                CAGR: <span className='bg-sky-700 text-white rounded-lg p-1 m-1'>{result.cagr?.toFixed(2)}%</span>
                            </div>
                            <button className="text-red-500 hover:-rotate-90 duration-700" onClick={() => setLeaderboardPlotOpen(false)}>
                                <ImCancelCircle size="1.5rem" />
                            </button>
                        </div>
                    </div>
                    <CandlePlot strategyResult={joinedInfo}
                        costPerTrade={formInputsLocal.costPerTrade}
                        symbol={formInputsLocal.symbol}
                        isEod={eodFreqs.includes(formInputsLocal.intval)}/>
                </div>
            </div>
        </div>
    )
}

export default LeaderboardPlot;