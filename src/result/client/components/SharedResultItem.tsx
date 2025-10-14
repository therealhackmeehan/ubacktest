import { useState } from "react";
import ResultHeader from "./ResultHeader";
import { FiBookOpen } from "react-icons/fi";
import OpenResult from "./OpenResult";
import DeleteShareModal from "./modals/DeleteShareModal";
import { FormInputProps, GetSharedProps } from "../../../shared/sharedTypes";
import { acceptShare } from "wasp/client/operations";
import { MdDeleteOutline } from "react-icons/md";

interface SharedResultItemProps {
  result: GetSharedProps;
}

const SharedResultItem = ({ result }: SharedResultItemProps) => {
  const [resultPanelOpen, setResultPanelOpen] = useState<boolean>(false);
  const [deleteSharedModalOpen, setDeleteSharedModalOpen] =
    useState<boolean>(false);
  const username = result.email?.split("@")[0] ?? "unknown";

  return (
    <li key={result.id}>
      {result.accepted ? (
        <div className="rounded-lg bg-white border-2 border-slate-500 items-center my-3 mx-1 px-2 py-2 md:py-0 md:flex justify-between dark:border-0 dark:bg-boxdark dark:text-white">
          <ResultHeader
            result={result}
            setResultPanelOpen={setResultPanelOpen}
          />
          <div className="flex gap-x-2 justify-between">
            <div className="text-xs p-2 m-1">from @{username}</div>
            <button
              className="hover:rotate-180 p-1 duration-500"
              onClick={() => setDeleteSharedModalOpen(true)}
            >
              <MdDeleteOutline />
            </button>
            <button
              className="px-3 py-1 flex rounded-lg bg-slate-100 m-1 hover:shadow-lg items-center gap-x-2 dark:bg-boxdark-2 dark:border-2 dark:border-blue-300"
              onClick={() => setResultPanelOpen(true)}
            >
              View
              <FiBookOpen />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between gap-x-2">
          <div className="font-light tracking-tight dark:text-white">
            @{username} sent you a result.
          </div>
          <div className="flex justify-between gap-x-2 p-1">
            <button
              className="bg-sky-700 rounded-lg text-xs font-bold text-white p-1 dark:bg-boxdark dark:border-2 dark:border-white"
              onClick={() => acceptShare({ id: result.sharedID })}
            >
              Accept
            </button>
            <button
              className="bg-white rounded-lg text-xs border-2 font-bold border-red-900 text-red-900 p-1"
              onClick={() => setDeleteSharedModalOpen(true)}
            >
              Deny
            </button>
          </div>
        </div>
      )}

      {/* Conditionally render modals only when needed */}
      {deleteSharedModalOpen && (
        <DeleteShareModal
          closeModal={() => setDeleteSharedModalOpen(false)}
          id={result.sharedID}
        />
      )}

      {resultPanelOpen && (
        <OpenResult
          formInputs={result.formInputs as unknown as FormInputProps}
          setResultPanelOpen={setResultPanelOpen}
          result={result}
        />
      )}
    </li>
  );
};

export default SharedResultItem;
