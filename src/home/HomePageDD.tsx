// react imports
import { useState } from "react";

// wasp imports
import { type Strategy } from "wasp/entities"
import { routes } from 'wasp/client/router';

// my imports
import { RenameModal, DeleteModal } from "../client/components/Modals";

// icon imports
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { FaRegEdit, FaChevronRight, FaChevronDown } from "react-icons/fa";

export function StrategyDropDownContents({ strategy }: { strategy: Strategy }) {

    // keep track of each dropdown's expansion
    const [isExpanded, setIsExpanded] = useState(false);

    // handle respective rename modal operations
    const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
    const handleCloseRenameModal = () => {
        setIsRenameModalOpen(false);
    }

    // handle delete modal operations
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    }

    // send latest info to local storage in case user clicks go to strategy
    const handleToLocalStorage = async (id: string) => {
        try {
            localStorage.setItem('projectToLoad', id);
        } catch (error) {
            console.log(error);
        } finally {
            window.location.href = routes.EditorRoute.build();
        }
    }

    return (
        <li key={strategy.id}>
            <div className='flex items-end px-4 justify-between dark:text-white'>
                <div className="absolute -ml-8 mb-1 hover:cursor-pointer hover:text-gray-500"
                    onClick={() => {
                        setIsExpanded(!isExpanded)
                    }}>
                    {isExpanded ? (
                        <FaChevronDown />
                    ) : (
                        <FaChevronRight />
                    )}
                </div>
                <div className='flex'>
                    <div className='mt-2 font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl  dark:text-white hover:text-gray-500 hover:cursor-pointer'
                        onClick={() => {
                            setIsExpanded(!isExpanded)
                        }}>
                        {strategy.name}
                    </div>
                    <button className='pl-3 hover:text-purple-500' title='Rename Strategy'
                        onClick={() => setIsRenameModalOpen(true)}>
                        <MdOutlineEdit size='1.4rem' />
                    </button>

                    <RenameModal isOpen={isRenameModalOpen}
                        action={handleCloseRenameModal}
                        id={strategy.id} />
                </div>
                <div className='flex items-end'>
                    <div className='flex items-center dark:text-white'>
                        <button className='hover:text-purple-500' title='Delete Strategy'
                            onClick={() => setIsDeleteModalOpen(true)}>
                            <MdDeleteOutline size='1.4rem' />
                        </button>

                        <DeleteModal isOpen={isDeleteModalOpen}
                            action={handleCloseDeleteModal}
                            id={strategy.id} />

                    </div>
                    <div className='font-mono text-purple-400 text-xs dark:text-white px-3'>
                        created {strategy.createdAt.toLocaleDateString()}
                    </div>
                    <div className='font-mono text-gray-700 text-sm dark:text-white px-3'>
                        last updated {strategy.updatedAt.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {isExpanded &&
                <>
                    <div className='relative group'>
                        <textarea className="select-none m-4 p-4 text-sm w-11/12 font-mono bg-slate-950 text-gray-300 rounded-lg border-purple-500 border-2 group-hover:bg-purple-950 resize-none duration-400"
                            readOnly={true}
                            value={strategy.code}
                            rows={15}
                            title='Open in Editor'>
                        </textarea>
                        <button
                            className="absolute invisible top-0 right-0 mr-24 mt-8 group-hover:visible text-white hover:rotate-6"
                            onClick={() => handleToLocalStorage(strategy.id)}
                        >
                            <FaRegEdit size='2rem' />
                        </button>
                    </div>
                </>
            }
            <div className="border m-4"></div>
        </li>
    )
}