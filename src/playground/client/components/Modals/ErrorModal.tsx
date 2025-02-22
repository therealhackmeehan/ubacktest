import { TiDelete } from "react-icons/ti";
import useEnterKey from "../../../../client/hooks/useEnterKey";
import ModalLayout from "../../../../client/components/ModalLayout";
import { Link } from "wasp/client/router";

interface ErrorModalProps {
    closeModal: () => void;
    msg: string;
}

export default function ErrorModal({ closeModal, msg }: ErrorModalProps) {

    useEnterKey(closeModal);
    const includePaymentLink = msg.toLowerCase().includes("purchase") || msg.toLowerCase().includes("subscription");

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
                {!includePaymentLink ?
                    <button
                        className="bg-slate-500 w-full text-white p-2 rounded hover:bg-slate-700"
                        onClick={closeModal}
                    >
                        OK
                    </button> :
                    <Link
                        to="/pricing"
                        className="bg-gradient-to-br from-sky-700 to-slate-600 w-full text-white text-center p-2 rounded hover:bg-slate-700"
                    >
                        Take a Look!
                    </Link>}
            </div>
        </ModalLayout>
    );
};