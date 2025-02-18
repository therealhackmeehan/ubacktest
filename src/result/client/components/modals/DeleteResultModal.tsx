import { useState } from 'react';
import { deleteResult } from 'wasp/client/operations';
import { TiDelete } from "react-icons/ti";
import useEnterKey from '../../../../client/hooks/useEnterKey';
import ModalLayout from '../../../../client/components/ModalLayout';

interface DeleteResultModalProps {
    closeModal: () => void;
    id: string;
}

export default function DeleteResultModal({ closeModal, id }: DeleteResultModalProps) {

    const [errMsg, setErrMsg] = useState('');

    const handleResultDelete = async () => {
        setErrMsg('');
        try {
            await deleteResult({ id });
            closeModal();
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    useEnterKey(handleResultDelete);

    return (
        <ModalLayout>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold dark:text-white">Are you sure you'd like to delete your <span className="text-slate-800 dark:text-blue-300">Saved Result</span>?</h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white' />
                </button>
            </div>
            <div className="py-4 text-center italic text-red-900 dark:text-red-100">
                Please note that this action will also remove this result for anyone it was shared with.
            </div>
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                    onClick={closeModal}
                >
                    Cancel
                </button>
                <button
                    className="bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
                    onClick={handleResultDelete}
                >
                    Confirm
                </button>
            </div>
            {errMsg &&
                <div className='mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-black'>
                    {errMsg}
                </div>}
        </ModalLayout>
    );
};
