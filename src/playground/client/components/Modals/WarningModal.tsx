import { TiDelete } from "react-icons/ti";
import useEnterKey from "../../../../client/hooks/useEnterKey";
import ModalLayout from "../../../../client/components/ModalLayout";

interface ErrorModalProps {
    closeModal: () => void;
    msg: string;
}

export default function WarningModal({ closeModal, msg }: ErrorModalProps) {

    useEnterKey(closeModal);

    return (
        <ModalLayout closeModal={closeModal}>
            <div className='flex justify-between'>
                <div className='p-3 tracking-tight font-bold text-gray-800 dark:text-white'>
                    Just a heads up...
                </div>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white' />
                </button>
            </div>
            <textarea rows={7} className='w-full border-0 border-transparent resize-none bg-white font-mono text-xs text-orange-700 dark:bg-boxdark-2 dark:text-orange-200' readOnly={true} value={msg}>
            </textarea>
            <div className="flex justify-between mt-4 gap-x-3">
                <button
                    className="bg-slate-500 w-full text-white p-2 rounded hover:bg-slate-700"
                    onClick={closeModal}
                >
                    OK
                </button>
            </div>
        </ModalLayout>
    );
};