import { useState, useContext, useEffect } from "react";
import DeleteModal from "../modals/DeleteModal";
import RenameModal from "../modals/RenameModal";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useAuth } from "wasp/client/auth";
import { Link } from "wasp/client/router";
import { StrategyContext } from "../../EditorPage";
import { Strategy } from "wasp/entities";

export default function StrategyHeader() {
  const { selectedStrategy, setSelectedStrategy } = useContext(StrategyContext);
  const { data: user } = useAuth();

  const [nameToDisplay, setNameToDisplay] = useState<string>(
    selectedStrategy.name,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedStrategy) {
      setNameToDisplay(selectedStrategy.name);
    }
  }, [selectedStrategy]);

  function onSuccessfulDeletion(s: Strategy | null) {
    setSelectedStrategy(s);
    setIsDeleteModalOpen(false);
  }

  function onSuccessfulRename(newName: string) {
    setNameToDisplay(newName);
    setIsRenameModalOpen(false);
  }

  return (
    <div className="text-gray-800 pt-3 py-2 px-3 flex justify-between items-center">
      <div className="flex gap-1">
        <Link
          title="go to strategy page"
          className="font-bold tracking-tight pb-1 text-xl md:text-3xl hover:text-sky-700 dark:text-white"
          key={selectedStrategy.id}
          to="/strategy/:id"
          params={{ id: selectedStrategy.id }}
        >
          {nameToDisplay}
        </Link>
        <button
          className="pl-3 hover:text-slate-500 text-sky-700 dark:text-blue-300 duration-700"
          title="Rename Strategy"
          onClick={() => setIsRenameModalOpen(true)}
        >
          <MdOutlineEdit size="1.4rem" />
        </button>

        {isRenameModalOpen && (
          <RenameModal
            onSuccess={onSuccessfulRename}
            closeModal={() => setIsRenameModalOpen(false)}
            id={selectedStrategy.id}
            currName={nameToDisplay}
          />
        )}
      </div>

      <div className="flex gap-1">
        <button
          className="hover:text-slate-500 text-sky-700 dark:text-blue-300 duration-700"
          title="Delete Strategy"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <MdDeleteOutline size="1.4rem" />
        </button>

        {isDeleteModalOpen && (
          <DeleteModal
            onSuccess={onSuccessfulDeletion}
            closeModal={() => setIsDeleteModalOpen(false)}
            id={selectedStrategy.id}
          />
        )}

        {!user?.subscriptionStatus && (
          <Link
            className="place-self-center pl-3 font-bold hover:rotate-3 duration-700 hover:text-slate-900 dark:text-white"
            to={"/pricing"}
          >
            {user?.credits}
            <span className="text-xs font-extralight"> tests remaining</span>
          </Link>
        )}
      </div>
    </div>
  );
}
