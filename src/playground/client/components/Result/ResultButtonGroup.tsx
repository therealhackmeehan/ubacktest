import { FiSave, FiShare, FiDownload } from "react-icons/fi"

export default function ResultButtonGroup() {

    return (
        <div className='flex justify-between'>
            <button className='flex gap-x-1 items-center p-2 m-1 tracking-tight bg-slate-500 hover:bg-slate-900 rounded-md text-white font-extralight'><FiSave /> save to my results </button>
            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-600 hover:bg-slate-900 rounded-md text-white font-extralight'><FiDownload /> download PDF </button>
            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-700 hover:bg-slate-900 rounded-md text-white font-extralight'><FiShare /> share </button>
            <button className='p-2 m-1 tracking-tight bg-slate-800 hover:bg-slate-900 rounded-md text-white font-light'>
                Implement With Real Money
                <span className="pl-1 text-xs font-extrabold tracking-tight uppercase align-top">
                    (Beta)
                </span>
            </button>
        </div>)
}