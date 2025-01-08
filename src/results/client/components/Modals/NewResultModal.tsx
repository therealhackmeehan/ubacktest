import { useState } from 'react';
import { validateNewName } from '../../../../playground/client/scripts/modalHelpers';
import useEnterKey from '../../../../client/hooks/useEnterKey';
import ModalLayout from '../../../../client/components/ModalLayout';
import { TiDelete } from 'react-icons/ti';

interface NewProjectModalProps {
    onSuccess: (name: string) => Promise<void>;
    closeModal: () => void;
    symbol: string,
}

export default function NewResultModal({ onSuccess, closeModal, symbol }: NewProjectModalProps) {

    const currDate = new Date();
    const currDateString: string = currDate.toLocaleDateString().replaceAll('/', '_')
    const fullPlaceholderName = symbol + '_result_' + currDateString;

    const [newResultName, setNewResultName] = useState<string>(fullPlaceholderName);
    const [errMsg, setErrMsg] = useState<string>('');

    const handleNewResult = async () => {
        setErrMsg('');
        try {
            validateNewName(newResultName);
            await onSuccess(newResultName);
            closeModal();
            alert('Success! Find the result in my saved results!')
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    useEnterKey(handleNewResult);

    return (
        <ModalLayout>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold">Save Result <span className="text-slate-800">To My Results</span></h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                </button>
            </div>
            <input
                type="text"
                placeholder="Enter result name"
                value={newResultName}
                onChange={(e) => setNewResultName(e.target.value)}
                className="border p-2 rounded w-full mt-4"
                autoFocus
            />
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                    onClick={closeModal}
                >
                    Cancel
                </button>
                <button
                    className="bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
                    onClick={handleNewResult}
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
