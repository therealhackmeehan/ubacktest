import { useState } from "react"
import { FiSave, FiShare, FiDownload } from "react-icons/fi"
import NewResultModal from "../modals/NewResultModal";
import { BiLockOpen, BiLock } from "react-icons/bi";

interface ResultButtonGroupProps {
    saveResult: (name: string) => Promise<void>;
    saveAsPDF: () => void;
    abilityToSaveNew: boolean;
    symbol: string;
    togglePrivacyFcn: () => void;
    isPublic: boolean;
}

export default function ResultButtonGroup({ saveResult, saveAsPDF, abilityToSaveNew, symbol, togglePrivacyFcn, isPublic }: ResultButtonGroupProps) {

    const [newResultModalOpen, setNewResultModalOpen] = useState<boolean>(false);

    function loadEmail() {
        console.log('saving as email')
    }

    return (
        <div className='flex justify-between text-sm'>

            {abilityToSaveNew ?
                <button className='flex gap-x-1 items-center p-2 m-1 tracking-tight bg-slate-500 hover:bg-slate-900 rounded-md text-white font-extralight'
                    onClick={() => setNewResultModalOpen(true)}>
                    <FiSave />
                    save to my results
                </button> :
                <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-sky-500 hover:bg-slate-900 text-white rounded-md'
                    onClick={togglePrivacyFcn}>
                    <BiLock /> Make Private
                </button>
            }
            <div className="border-r-2 mx-2 border-black/60"></div>

            {newResultModalOpen &&
                <NewResultModal onSuccess={saveResult}
                    closeModal={() => setNewResultModalOpen(false)}
                    symbol={symbol} />
            }

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-600 hover:bg-slate-900 text-white rounded-md'
                onClick={saveAsPDF}>
                <FiDownload /> download PDF
            </button>

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-sky-700 hover:bg-slate-900 text-white rounded-md'
                onClick={loadEmail}>
                <FiShare /> share
            </button>
        </div>)
}