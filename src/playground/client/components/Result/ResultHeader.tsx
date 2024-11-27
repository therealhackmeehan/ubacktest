import { FiSave, FiShare } from "react-icons/fi"
import { IoCloudDownloadOutline } from "react-icons/io5"

interface ResultHeaderProps {
    symbol: string;
}

export default function ResultHeader({ symbol }: ResultHeaderProps) {
    return (
        <div className='items-center flex p-2 justify-between border-b-2 border-black'>
            <h4 className="tracking-tight text-xl font-extrabold text-center">
                Stock Data and Simulated Backtest Result for {symbol}
            </h4>
            <div className='flex justify-between'>
                <button className='p-2 m-1 tracking-tight bg-gray-700 hover:bg-gray-900 rounded-md text-white font-light'><FiSave /></button>
                <button className='p-2 m-1 tracking-tight bg-gray-700 hover:bg-gray-900 rounded-md text-white font-light'><IoCloudDownloadOutline /></button>
                <button className='p-2 m-1 tracking-tight bg-gray-700 hover:bg-gray-900 rounded-md text-white font-light'><FiShare /></button>
                <button className='p-2 m-1 tracking-tight bg-gray-700 hover:bg-gray-900 rounded-md text-white font-light'>
                    Implement With Real Money
                    <span className="pl-1 text-xs font-extrabold tracking-tight uppercase align-top">
                        (Beta)
                    </span>
                </button>
            </div>
        </div>
    )
}