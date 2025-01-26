import { useState } from "react"
import { FiSave, FiShare, FiDownload } from "react-icons/fi"
import NewResultModal from "../modals/NewResultModal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import LoadingScreen from "../../../../client/components/LoadingScreen";

interface ResultButtonGroupProps {
    saveResult: (name: string) => Promise<void>;
    abilityToSaveNew: boolean;
    symbol: string;
}

export default function ResultButtonGroup({ saveResult, abilityToSaveNew, symbol }: ResultButtonGroupProps) {

    const [newResultModalOpen, setNewResultModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    function saveAsPDF() {
        console.log('saving as pdf')
    }

    function loadEmail() {
        console.log('saving as email')
    }

    return (
        <div className='flex justify-between'>

            {abilityToSaveNew &&
                <>
                    <button className='flex gap-x-1 items-center p-2 m-1 tracking-tight bg-slate-500 hover:bg-slate-900 rounded-md text-white font-extralight'
                        onClick={() => setNewResultModalOpen(true)}>
                        <FiSave />
                        save to my results
                    </button>
                    <div className="border-r-2 mx-2 border-black/60"></div>
                </>
            }

            {loading && <LoadingScreen />}

            {newResultModalOpen &&
                <NewResultModal onSuccess={saveResult}
                    closeModal={() => setNewResultModalOpen(false)}
                    symbol={symbol} />
            }

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-600 hover:bg-slate-900 rounded-md text-white'
                onClick={saveAsPDF}>
                <FiDownload /> download PDF
            </button>

            <button className='flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-700 hover:bg-slate-900 rounded-md text-white'
                onClick={loadEmail}>
                <FiShare /> share
            </button>
        </div>)
}