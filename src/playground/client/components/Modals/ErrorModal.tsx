import { TiDelete } from "react-icons/ti";
import useEnterKey from "../../../../client/hooks/useEnterKey";
import ModalLayout from "../../../../client/components/ModalLayout";

interface ErrorModalProps {
    closeModal: () => void;
    msg: string;
}

export default function ErrorModal({ closeModal, msg }: ErrorModalProps) {

    useEnterKey(closeModal);

    return (
        <ModalLayout>
            <div className='flex justify-between text-gray-800 dark:text-white'>
                <div className='p-3 tracking-tight font-bold'>
                    We've Encountered an Error...
                </div>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 hover:scale-110' />
                </button>
            </div>
            <textarea rows={7} className='w-full border-0 border-transparent resize-none bg-white font-mono text-xs text-red-700 dark:bg-black dark:text-red-200' readOnly={true} value={msg}>
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