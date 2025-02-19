import { Strategy } from "wasp/entities";
import { Link, routes } from 'wasp/client/router';
import RenameModal from "../../playground/client/components/modals/RenameModal";
import DeleteModal from "../../playground/client/components/modals/DeleteModal";
import { MdArrowBack, MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useState } from "react";

function StrategyOverview({ strategy }: { strategy: Strategy }) {

    const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    const [nameToDisplay, setNameToDisplay] = useState<string>(strategy.name);

    function onSuccessfulDeletion() {
        setDeleteModalOpen(false);
        window.location.href = routes.HomePageRoute.build();
    }

    function onSuccesfulRename(newName: string) {
        setNameToDisplay(newName)
        setRenameModalOpen(false);
    }

    return (
        <>
            <Link className="p-t1 mb-8 mx-1 duration-500 items-center flex gap-x-1 hover:underline hover:bg-slate-50 rounded-lg dark:text-white dark:hover:bg-black"
                to={"/home"}>
                <MdArrowBack /> back to strategies
            </Link>
            <div className="lg:flex justify-between items-end m-2">
                <div className="text-3xl lg:text-6xl tracking-tight font-bold dark:text-white">
                    <span className="text-sm mr-3 text-sky-600 dark:text-blue-300">strategy</span>{nameToDisplay}<span className="text-sky-600 dark:text-blue-300">.</span>
                </div>

                <div className="text-end mt-4 md:mt-0">
                    <button className='hover:text-slate-500 dark:text-white' onClick={() => setRenameModalOpen(true)}>
                        <MdOutlineEdit size='2rem' />
                    </button>

                    {renameModalOpen &&
                        <RenameModal
                            currName={nameToDisplay}
                            id={strategy.id}
                            closeModal={() => setRenameModalOpen(false)}
                            onSuccess={onSuccesfulRename} />
                    }

                    <button className='hover:text-slate-500 dark:text-white' onClick={() => setDeleteModalOpen(true)}>
                        <MdDeleteOutline size='2rem' />
                    </button>

                    {deleteModalOpen &&
                        <DeleteModal
                            id={strategy.id}
                            closeModal={() => setDeleteModalOpen(false)}
                            onSuccess={onSuccessfulDeletion} />
                    }
                </div>

                <div className="text-end font-light text-xs md:text-base dark:text-blue-300">
                    <div>
                        created: {strategy.createdAt.toLocaleString()}
                    </div>
                    <div>
                        last updated: {strategy.updatedAt.toLocaleString()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default StrategyOverview;