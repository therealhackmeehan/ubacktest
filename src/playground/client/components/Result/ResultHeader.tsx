import ResultButtonGroup from "./ResultButtonGroup";

interface ResultHeaderProps {
    symbol: string;
}

export default function ResultHeader({ symbol }: ResultHeaderProps) {
    return (
        <div id='topOfResult' className='items-center flex p-2 justify-between border-b-2 border-black'>
            <h4 className="tracking-tight text-xl font-extrabold text-center">
                Stock Data and Simulated Backtest Result for {symbol}
            </h4>
            <ResultButtonGroup />
        </div>
    )
}