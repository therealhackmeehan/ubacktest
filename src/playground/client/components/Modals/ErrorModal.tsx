import { TiDelete } from "react-icons/ti";
import useEnterKey from "../../../../client/hooks/useEnterKey";

interface ErrorModalProps {
    onClose: () => void;
    msg: string;
}

export default function ErrorModal({ onClose, msg }: ErrorModalProps) {

    useEnterKey(onClose);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/4 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <div className='p-3 tracking-tight font-bold text-gray-800'>
                        We've Encountered an Error...
                    </div>
                    <button onClick={onClose}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                    </button>
                </div>
                <textarea rows={7} className='w-full border-0 border-transparent bg-gray-100 rounded-lg font-bold text-xs text-red-700 tracking-tight' readOnly={true} value={msg}>
                </textarea>
                <div className="flex justify-between mt-4 gap-x-3">
                    <button
                        className="bg-slate-500 w-full text-white p-2 rounded hover:bg-slate-700"
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )

}