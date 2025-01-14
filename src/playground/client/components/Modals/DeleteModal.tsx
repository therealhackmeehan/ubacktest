import { useState } from 'react';
import { deleteStrategy, getStrategies } from 'wasp/client/operations';
import { TiDelete } from "react-icons/ti";
import useEnterKey from '../../../../client/hooks/useEnterKey';
import ModalLayout from '../../../../client/components/ModalLayout';
import { Strategy } from 'wasp/entities';

interface DeleteModalProps {
    onSuccess: (s: Strategy | null) => void;
    closeModal: () => void;
    id: string;
}

export default function DeleteModal({ onSuccess, closeModal, id }: DeleteModalProps) {

    const [errMsg, setErrMsg] = useState('');

    const handleStrategyDelete = async () => {
        setErrMsg('');
        try {
            await deleteStrategy({ id });
            const strategies = await getStrategies();

            if (strategies) {
                onSuccess(strategies[0]);
            } else {
                onSuccess(null);
            }
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    useEnterKey(handleStrategyDelete);

    return (
        <ModalLayout>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold">Are you sure you'd like to delete your <span className="text-slate-800">strategy</span>?</h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                </button>
            </div>
            <div className="py-4 text-center italic text-red-900">please NOTE that this will also delete this strategy's saved results.</div>
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                    onClick={closeModal}
                >
                    Cancel
                </button>
                <button
                    className="bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
                    onClick={handleStrategyDelete}
                >
                    Confirm
                </button>
            </div>
            {errMsg &&
                <div className='mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-base'>
                    {errMsg}
                </div>}
        </ModalLayout>
    );
};
