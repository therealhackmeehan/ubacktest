import { useState } from "react";
import { renameStrategy } from "wasp/client/operations";
import { TiDelete } from "react-icons/ti";
import { validateNewName } from "../../scripts/modalHelpers";
import useEnterKey from "../../../../client/hooks/useEnterKey";
import ModalLayout from "../../../../client/components/ModalLayout";

interface RenameModalProps {
  onSuccess: (newName: string) => void;
  closeModal: () => void;
  id: string;
  currName: string;
}

export default function RenameModal({
  onSuccess,
  closeModal,
  id,
  currName,
}: RenameModalProps) {
  const [newName, setNewName] = useState<string>(currName);
  const [errMsg, setErrMsg] = useState<string>("");

  const handleRename = async () => {
    setErrMsg("");
    try {
      validateNewName(newName);
      await renameStrategy({ id, name: newName });
      onSuccess(newName);
    } catch (error: any) {
      setErrMsg(error.message);
    }
  };

  useEnterKey(handleRename);

  return (
    <ModalLayout closeModal={closeModal}>
      <div className="flex justify-between">
        <h2 className="text-base text-slate-500 font-semibold dark:text-white">
          Rename Your{" "}
          <span className="text-slate-800 dark:text-blue-300">Strategy</span>
        </h2>
        <button onClick={closeModal}>
          <TiDelete
            size="1.8rem"
            className="hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white"
          />
        </button>
      </div>
      <input
        type="text"
        placeholder="Enter new name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="border p-2 rounded w-full mt-4"
        autoFocus
      />
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
          onClick={handleRename}
        >
          Confirm
        </button>
      </div>
      {errMsg && (
        <div className="mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-black">
          {errMsg}
        </div>
      )}
    </ModalLayout>
  );
}
