import { useState } from 'react';

import {
    renameStrategy,
    deleteStrategy,
    createStrategy,
} from 'wasp/client/operations';

import { TiDelete } from "react-icons/ti";

interface ModalProps {
    isOpen: boolean;
    action: () => void;
    id: string;           
}

export const RenameModal: React.FC<ModalProps> = ({ isOpen, action, id }) => {
    
    const [newName, setNewName] = useState<string>('');

    const handleRename = async () => {
        try {
            await renameStrategy({ id, name: newName });
            action();
        } catch (error) {
            console.error('Failed to update name:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-xl text-purple-500 font-semibold">Rename Your <span className="text-slate-800">Strategy</span></h2>
                    <button onClick={action}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 hover:scale-110' />
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
                        onClick={action}
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
            </div>
        </div>
    );
};

export const DeleteModal: React.FC<ModalProps> = ({ isOpen, action, id }) => {
    
    const handleStrategyDelete = async () => {
        try {
            await deleteStrategy({ id });
            action();
        } catch (error) {
            console.error('Failed to delete strategy:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-xl text-purple-500 font-semibold">Are you sure you'd like to delete your <span className="text-slate-800">strategy</span>?</h2>
                    <button onClick={action}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 hover:scale-110' />
                    </button>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                        onClick={action}
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
            </div>
        </div>
    );
};

export const NewProjectModal: React.FC<ModalProps> = ({ isOpen, action }) => {
    
    const [newProjectName, setNewProjectName] = useState<string>('');

    const handleNewProject = async () => {
        try {
            const starter = "Start Editing Your Strategy!!";
            await createStrategy({ name: newProjectName, code: starter });
            setNewProjectName('');
            action(); // Close modal after successful project creation
        } catch (error) {
            console.error('Failed to create new project:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-xl text-purple-500 font-semibold">Create New <span className="text-slate-800">Strategy</span></h2>
                    <button onClick={action}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 hover:scale-110' />
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
                        onClick={action}
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
            </div>
        </div>
    );
};