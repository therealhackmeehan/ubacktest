import { IoMdAddCircleOutline } from "react-icons/io"
import { useState } from "react";
import { NewProjectModal } from "./modals/Modals";

export default function PageHeader({setSelectedStrategy}: {setSelectedStrategy: (id: string) => void}) {

    const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

    function onSuccessfulNewProject(id: string) {
        setSelectedStrategy(id);
        setNewProjectModalOpen(false);
    }

    return (
        <div className="flex justify-between py-4">
            <h4 className='font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white'>
                The <span className='text-purple-500'>Backtest Engine</span> <span className="text-sm"> & Strategy Editor </span>
            </h4>

            <button className='group hover:bg-gray-200 gap-2 flex bg-gray-100 rounded-lg p-1 pr-3 dark:bg-gray-600 dark:border-2 dark:border-white'
                onClick={() => setNewProjectModalOpen(true)}>
                <IoMdAddCircleOutline size='3rem' className='text-purple-500 group-hover:rotate-6 group-hover:scale-110 duration-500' />
                <span className='font-bold text-xl'>new</span>
            </button>

            {newProjectModalOpen && <NewProjectModal
                onSuccess={onSuccessfulNewProject}
                onFailure={() => setNewProjectModalOpen(false)}
            />}
        </div>
    )
}