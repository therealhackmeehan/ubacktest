import { useState } from "react";
import { DeleteModal, RenameModal } from "../Modals/Modals"
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";

interface StrategyHeaderProps {
    name: string;
    ID: string;
    result: any;
    resultOpen: boolean;
    setNameToDisplay: (value: string) => void;
    setSelectedStrategy: (value: string) => void;
    setResultOpen: (value: boolean) => void;
}

export default function StrategyHeader({ name, ID, result, resultOpen, setNameToDisplay, setSelectedStrategy, setResultOpen }: StrategyHeaderProps) {
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
        <div className="text-gray-800 pt-3 px-3 flex justify-between items-center">
            <h4 className='font-bold tracking-tight pb-1 text-3xl'>
                {name}
            </h4>
            <div className="flex pl-4 gap-2">

                <button className='hover:text-purple-500 duration-700' title='Delete Strategy'
                    onClick={() => setIsDeleteModalOpen(true)}>
                    <MdDeleteOutline size='1.4rem' />
                </button>

                {isDeleteModalOpen &&
                    <DeleteModal
                        onSuccess={onSuccessfulDeletion}
                        onFailure={() => setIsDeleteModalOpen(false)}
                        id={ID} />
                }

                <button className='pl-3 hover:text-purple-500 duration-700' title='Rename Strategy'
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
                    <button className="place-self-center pl-3 font-bold hover:rotate-3 duration-700 hover:text-purple-900"
                        onClick={goToPricingPage}>{user?.credits}
                        <span className="text-xs font-extralight"> tests remaining</span>
                    </button>}

            </div>
        </div>
    )
}