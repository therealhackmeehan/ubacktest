import { useState } from "react";
import { DeleteModal, RenameModal } from "./modals/Modals"
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";

interface StrategyHeaderProps {
    name: string;
    ID: string;
    setNameToDisplay: (value: string) => void;
    setSelectedStrategy: (value: string) => void;
}

export default function StrategyHeader({ name, ID, setNameToDisplay, setSelectedStrategy }: StrategyHeaderProps) {
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
        <div className="bg-purple-900 flex justify-between rounded-lg">
            <div className="flex pl-4 gap-2">

                <button className='hover:text-purple-500 duration-700 text-white' title='Delete Strategy'
                    onClick={() => setIsDeleteModalOpen(true)}>
                    <MdDeleteOutline size='1.4rem' />
                </button>

                {isDeleteModalOpen &&
                    <DeleteModal
                        onSuccess={onSuccessfulDeletion}
                        onFailure={() => setIsDeleteModalOpen(false)}
                        id={ID} />
                }

                <button className='pl-3 hover:text-purple-500 duration-700 text-purple-300' title='Rename Strategy'
                    onClick={() => setIsRenameModalOpen(true)}>
                    <MdOutlineEdit size='1.4rem' />
                </button>

                {isRenameModalOpen &&
                    <RenameModal
                        onSuccess={onSuccessfulRename}
                        onFailure={() => setIsRenameModalOpen(false)}
                        id={ID}
                        currName={name} />
                }

                {(user?.subscriptionStatus != "active") &&
                    <button className="place-self-center pl-3 font-bold text-white hover:rotate-3 duration-700 hover:text-gray-200"
                        onClick={goToPricingPage}>{user?.credits}
                        <span className="text-xs font-extralight"> tests remaining</span>
                    </button>}

            </div>
            <h4 className='font-bold text-end tracking-tight pt-3 px-3 pb-1 space-x-2 text-white sm:text-3xl text-xl dark:text-white'>
                <span className="text-base">strategy:</span>
                <span className='text-purple-300 py-12'>{name}</span>
            </h4>
        </div>
    )
}