import { useState } from 'react';
import { TiDelete } from "react-icons/ti";
import { validateNewName } from '../../scripts/modalHelpers';

interface NewProjectModalProps {
    onSuccess: (name: string) => Promise<void>;
    onFailure: () => void;
}

export default function NewResultModal({ onSuccess, onFailure }: NewProjectModalProps) {

    const [newResultName, setNewResultName] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');

    const handleNewResult = async () => {
        setErrMsg('');
        try {
            validateNewName(newResultName);
            onSuccess(newResultName);
            onFailure();
            alert('Success! Find the result in my saved results!')
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-base text-slate-500 font-semibold">Save Result <span className="text-slate-800">To My Results</span></h2>
                    <button onClick={onFailure}>
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
                        onClick={onFailure}
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
            </div>
        </div>
    );
};
