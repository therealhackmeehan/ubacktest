import { useState } from 'react';

import {
    renameStrategy,
    deleteStrategy,
    createStrategy,
    getStrategies,
} from 'wasp/client/operations';

import { TiDelete } from "react-icons/ti";

import { validateNewName } from './modalHelpers';

interface RenameModalProps {
    onSuccess: (newName: string) => void;
    onFailure: () => void;
    id: string;
    currName: string;
}

export function RenameModal({ onSuccess, onFailure, id, currName }: RenameModalProps) {

    const [newName, setNewName] = useState<string>(currName);
    const [errMsg, setErrMsg] = useState<string>('');

    const handleRename = async () => {
        setErrMsg('');
        try {
            validateNewName(newName);
            await renameStrategy({ id, name: newName });
            onSuccess(newName);
        } catch (error) {
            setErrMsg(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-xl text-purple-500 font-semibold">Rename Your <span className="text-slate-800">Strategy</span></h2>
                    <button onClick={onFailure}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Enter new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border p-2 rounded w-full mt-4"
                />
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                        onClick={onFailure}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-purple-500 text-white p-2 rounded hover:bg-purple-700"
                        onClick={handleRename}
                    >
                        Confirm
                    </button>
                </div>
                {errMsg &&
                    <div className='mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-xs'>
                        {errMsg}
                    </div>}
            </div>
        </div>
    );
};

interface DeleteModalProps {
    onSuccess: (value: string) => void;
    onFailure: () => void;
    id: string;
}

export function DeleteModal({ onSuccess, onFailure, id }: DeleteModalProps) {

    const [errMsg, setErrMsg] = useState('');

    const handleStrategyDelete = async () => {
        setErrMsg('');
        try {
            await deleteStrategy({ id });
            const strategies = await getStrategies();

            if (strategies.length > 0) {
                onSuccess(strategies[0].id);
            } else {
                const starter = "Start Editing Your Strategy!!";
                const newID = await createStrategy({ name: "MyFirstStrategy", code: starter });
                onSuccess(newID.id);
            }
        } catch (error) {
            setErrMsg(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-xl text-purple-500 font-semibold">Are you sure you'd like to delete your <span className="text-slate-800">strategy</span>?</h2>
                    <button onClick={onFailure}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                    </button>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                        onClick={onFailure}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-purple-500 text-white p-2 rounded hover:bg-purple-700"
                        onClick={handleStrategyDelete}
                    >
                        Confirm
                    </button>
                </div>
                {errMsg &&
                    <div className='mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-xs'>
                        {errMsg}
                    </div>}
            </div>
        </div>
    );
};

interface NewProjectModalProps {
    onSuccess: (id: string) => void;
    onFailure: () => void;
}

export function NewProjectModal({ onSuccess, onFailure }: NewProjectModalProps) {

    const [newProjectName, setNewProjectName] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');

    const handleNewProject = async () => {
        setErrMsg('');
        try {
            validateNewName(newProjectName);
            const starter = "Start Editing Your Strategy!!";
            const newID = await createStrategy({ name: newProjectName, code: starter });
            onSuccess(newID.id);
        } catch (error) {
            setErrMsg(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-xl text-purple-500 font-semibold">Create New <span className="text-slate-800">Strategy</span></h2>
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
                />
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                        onClick={onFailure}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-purple-500 text-white p-2 rounded hover:bg-purple-700"
                        onClick={handleNewProject}
                    >
                        Confirm
                    </button>
                </div>
                {errMsg &&
                    <div className='mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-xs'>
                        {errMsg}
                    </div>}
            </div>
        </div>
    );
};

interface ErrorModalProps {
    onClose: () => void;
    msg: string;
}
export function ErrorModal({ onClose, msg }: ErrorModalProps) {

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/4 rounded-lg shadow-lg z-10">
                <div className='font-bold text-red-700 tracking-tight'>
                    {msg}
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-purple-500 w-full text-white p-2 rounded hover:bg-purple-700"
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )

}