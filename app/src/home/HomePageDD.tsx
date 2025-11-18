import { useState } from "react";
import { type Strategy } from "wasp/entities";
import { Link } from "wasp/client/router";
import RenameModal from "../editor/client/components/modals/RenameModal";
import DeleteModal from "../editor/client/components/modals/DeleteModal";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";

export function StrategyDropDown({ strategy }: { strategy: Strategy }) {
  // keep track of modal states
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  return (
    <li
      key={strategy.id}
      className="border-t-2 border-gray-100 md:px-2 py-3 transition-all duration-[500ms]"
    >
      <div className="flex justify-between">
        <div className="flex gap-x-2 items-center">
          <Link
            className="font-bold text-xl tracking-tight text-gray-900 hover:text-gray-500 hover:scale-110 duration-500 hover:cursor-pointer dark:text-white"
            key={strategy.id}
            to="/strategy/:id"
            params={{ id: strategy.id }}
          >
            {strategy.name}
          </Link>
        </div>
        <div className="flex items-end">
          <button
            className="pl-3 hover:text-slate-500 dark:text-blue-300"
            title="Rename Strategy"
            onClick={() => setIsRenameModalOpen(true)}
          >
            <MdOutlineEdit size="1.4rem" />
          </button>
          {isRenameModalOpen && (
            <RenameModal
              onSuccess={() => setIsRenameModalOpen(false)}
              closeModal={() => setIsRenameModalOpen(false)}
              id={strategy.id}
              currName={strategy.name}
            />
          )}

          <button
            className="hover:text-slate-500 px-1 dark:text-blue-300"
            title="Delete Strategy"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <MdDeleteOutline size="1.2rem" />
          </button>
          {isDeleteModalOpen && (
            <DeleteModal
              onSuccess={() => setIsDeleteModalOpen(false)}
              closeModal={() => setIsDeleteModalOpen(false)}
              id={strategy.id}
            />
          )}

          <div className="font-light text-slate-400 text-xs dark:text-white px-2">
            created {strategy.createdAt.toLocaleDateString()}
          </div>
          <div className="hidden md:flex font-light text-gray-700 text-sm dark:text-white px-2">
            last updated {strategy.updatedAt.toLocaleDateString()}
          </div>
        </div>
      </div>
    </li>
  );
}
