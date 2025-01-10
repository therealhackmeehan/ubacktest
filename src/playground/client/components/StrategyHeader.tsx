import { useState } from "react";
import DeleteModal from "./modals/DeleteModal";
import RenameModal from "./modals/RenameModal";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useAuth } from "wasp/client/auth";
import { routes, Link } from "wasp/client/router";

interface StrategyHeaderProps {
    nameToDisplay: string;
    selectedStrategy: string;
    setNameToDisplay: (value: string) => void;
    setSelectedStrategy: (value: string) => void;
}

export default function StrategyHeader({ nameToDisplay, selectedStrategy, setNameToDisplay, setSelectedStrategy }: StrategyHeaderProps) {
    const { data: user } = useAuth();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);

    function onSuccessfulDeletion(id: string) {
        setSelectedStrategy(id);
        setIsDeleteModalOpen(false);
    }

    function onSuccessfulRename(newName: string) {
        setNameToDisplay(newName)
        setIsRenameModalOpen(false);
    }

    function goToPricingPage() {
        window.location.href = routes.PricingPageRoute.build();
    }

    return (
        <div className="text-gray-800 pt-3 px-3 mx-1 flex justify-between items-center">

            <div className="flex gap-1">
                <Link
                    title='go to strategy page'
                    className="font-bold tracking-tight pb-1 text-3xl hover:text-slate-500"
                    key={selectedStrategy}
                    to="/strategy/:id"
                    params={{ id: selectedStrategy }}>
                    {nameToDisplay}
                </Link>
                <button className='pl-3 hover:text-slate-500 text-sky-600 duration-700' title='Rename Strategy'
                    onClick={() => setIsRenameModalOpen(true)}>
                    <MdOutlineEdit size='1.4rem' />
                </button>

                {isRenameModalOpen &&
                    <RenameModal
                        onSuccess={onSuccessfulRename}
                        closeModal={() => setIsRenameModalOpen(false)}
                        id={selectedStrategy}
                        currName={nameToDisplay} />
                }

            </div>

            <div className="flex gap-1">

                <button className='hover:text-slate-500 text-sky-600 duration-700' title='Delete Strategy'
                    onClick={() => setIsDeleteModalOpen(true)}>
                    <MdDeleteOutline size='1.4rem' />
                </button>

                {isDeleteModalOpen &&
                    <DeleteModal
                        onSuccess={onSuccessfulDeletion}
                        closeModal={() => setIsDeleteModalOpen(false)}
                        id={selectedStrategy} />
                }

                {(user?.subscriptionStatus != "active") &&
                    <button className="place-self-center pl-3 font-bold hover:rotate-3 duration-700 hover:text-slate-900"
                        onClick={goToPricingPage}>{user?.credits}
                        <span className="text-xs font-extralight"> tests remaining</span>
                    </button>}

            </div>

        </div>
    )
}