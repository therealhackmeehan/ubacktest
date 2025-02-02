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
            <Link className="p-t1 mb-8 mx-1 items-center flex gap-x-1 hover:underline hover:bg-slate-50 rounded-lg"
                to={"/home"}>
                <MdArrowBack /> back to strategies
            </Link>
            <div className="lg:flex justify-between items-end m-2">
                <div className="text-3xl lg:text-6xl tracking-tight font-bold">
                    <span className="text-sm mr-3 text-sky-600">strategy</span>{nameToDisplay}<span className="text-sky-600">.</span>
                </div>

                <div className="text-end">
                    <button className='hover:text-slate-500' onClick={() => setRenameModalOpen(true)}>
                        <MdOutlineEdit size='2rem' />
                    </button>

                    {renameModalOpen &&
                        <RenameModal
                            currName={nameToDisplay}
                            id={strategy.id}
                            closeModal={() => setRenameModalOpen(false)}
                            onSuccess={onSuccesfulRename} />
                    }

                    <button className='hover:text-slate-500' onClick={() => setDeleteModalOpen(true)}>
                        <MdDeleteOutline size='2rem' />
                    </button>

                    {deleteModalOpen &&
                        <DeleteModal
                            id={strategy.id}
                            closeModal={() => setDeleteModalOpen(false)}
                            onSuccess={onSuccessfulDeletion} />
                    }
                </div>

                <div className="text-end font-light">
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