import { useState } from 'react';
import { createStrategy } from 'wasp/client/operations';
import { TiDelete } from "react-icons/ti";
import { validateNewName } from '../../scripts/modalHelpers';
import { starterCode } from './starterTemplate';
import useEnterKey from '../../../../client/hooks/useEnterKey';

interface NewProjectModalProps {
    onSuccess: (id: string) => void;
    onFailure: () => void;
}

export default function NewProjectModal({ onSuccess, onFailure }: NewProjectModalProps) {

    const [newProjectName, setNewProjectName] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');

    const handleNewProject = async () => {
        setErrMsg('');
        try {
            validateNewName(newProjectName);
            const newID = await createStrategy({ name: newProjectName, code: starterCode });
            onSuccess(newID.id);
        } catch (error: any) {
            setErrMsg(error.message);
        }
    };

    useEnterKey(handleNewProject);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-base text-slate-500 font-semibold">Create New <span className="text-slate-800">Strategy</span></h2>
                    <button onClick={onFailure}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Enter strategy name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
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
                        onClick={handleNewProject}
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
