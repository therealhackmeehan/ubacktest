import { useState } from "react";
import { type Strategy } from "wasp/entities"
import { routes } from 'wasp/client/router';
import RenameModal from "../../../playground/client/components/Modals/RenameModal";
import DeleteModal from "../../../playground/client/components/Modals/DeleteModal";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { FaRegEdit, FaChevronRight, FaChevronDown } from "react-icons/fa";

export function StrategyDropDown({ strategy }: { strategy: Strategy }) {

    // keep track of each dropdown's expansion
    const [isExpanded, setIsExpanded] = useState(false);

    // keep track of modal states
    const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [toolTipShown, setIsToolTipShown] = useState<boolean>(false);

    // send latest info to local storage in case user clicks go to strategy
    const handleToLocalStorage = async (id: string) => {
        try {
            localStorage.setItem('projectToLoad', id);
        } catch (error) {
            console.log(error);
        } finally {
            window.location.href = routes.PlaygroundRoute.build();
        }
    }

    return (
        <li className="border-t-2 border-gray-100 p-2" key={strategy.id}>
            <div className='flex justify-between'>
                <div className='flex gap-x-2 items-center'>
                    <div className="hover:cursor-pointer hover:text-gray-500"
                        onClick={() => {
                            setIsExpanded(!isExpanded)
                        }}>
                        {isExpanded ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}
                    </div>
                    <div className='font-bold tracking-tight text-gray-900 hover:text-gray-500 hover:cursor-pointer'
                        onClick={() => {
                            setIsExpanded(!isExpanded)
                        }}>
                        {strategy.name}
                    </div>
                </div>
                <div className='flex items-end'>
                    <button className='pl-3 hover:text-slate-500' title='Rename Strategy'
                        onClick={() => setIsRenameModalOpen(true)}>
                        <MdOutlineEdit size='1.4rem' />
                    </button>

                    {isRenameModalOpen && <RenameModal
                        onSuccess={() => setIsRenameModalOpen(false)}
                        onFailure={() => setIsRenameModalOpen(false)}
                        id={strategy.id}
                        currName={strategy.name} />}


                    <button className='hover:text-slate-500 px-1' title='Delete Strategy'
                        onClick={() => setIsDeleteModalOpen(true)}>
                        <MdDeleteOutline size='1.2rem' />
                    </button>

                    {isDeleteModalOpen && <DeleteModal
                        onSuccess={() => setIsDeleteModalOpen(false)}
                        onFailure={() => setIsDeleteModalOpen(false)}
                        id={strategy.id} />}

                    <div className='font-light text-slate-400 text-xs dark:text-white px-2'>
                        created {strategy.createdAt.toLocaleDateString()}
                    </div>
                    <div className='font-light text-gray-700 text-sm dark:text-white px-2'>
                        last updated {strategy.updatedAt.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {isExpanded &&
                <div className='relative group'>
                    <textarea className="select-none m-4 p-4 text-sm w-11/12 font-mono bg-slate-950 text-gray-300 rounded-lg border-slate-500 border-2 group-hover:text-black group-hover:bg-slate-300 resize-none duration-400"
                        readOnly={true}
                        value={strategy.code}
                        rows={15}
                        title='Open in Editor'>
                    </textarea>
                    <button
                        className="absolute invisible top-0 right-0 mr-24 mt-8 group-hover:visible duration-700 ease-in-out text-white hover:scale-110"
                        onClick={() => handleToLocalStorage(strategy.id)}
                        onMouseEnter={() => setIsToolTipShown(true)}
                        onMouseLeave={() => setIsToolTipShown(false)}
                    >
                        <div className="p-2 flex">
                            {toolTipShown &&
                                <div className="p-1 mx-3 opacity-75 duration-700 bg-white text-gray-800 font-light rounded-md border-2 text-xs hover:scale-110">
                                    Edit {strategy.name} in Editor
                                </div>
                            }
                            <FaRegEdit size='2rem' />
                        </div>
                    </button>
                </div>
            }
        </li>
    )
}