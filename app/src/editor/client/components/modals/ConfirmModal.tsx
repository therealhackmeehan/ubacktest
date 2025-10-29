import ModalLayout from "../../../../client/components/ModalLayout";
import useEnterKey from "../../../../client/hooks/useEnterKey";

interface ConfirmModalProps {
  msg: string;
  onConfirm: () => void;
  closeModal: () => void;
}

export default function ConfirmModal({
  msg,
  onConfirm,
  closeModal,
}: ConfirmModalProps) {
  useEnterKey(onConfirm);

  return (
    <ModalLayout closeModal={closeModal}>
      <div className="flex justify-between">
        <h2 className="text-base text-slate-500 font-semibold dark:text-white">
          {msg}
        </h2>
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </ModalLayout>
  );
}
