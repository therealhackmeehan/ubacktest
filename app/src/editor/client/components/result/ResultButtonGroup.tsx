import { useState } from "react";
import { FiSave, FiDownload } from "react-icons/fi";
import NewResultModal from "../modals/NewResultModal";
import { isFirefox } from "./Result";

interface ResultButtonGroupProps {
  saveResult: (name: string) => Promise<void>;
  saveAsPDF: () => void;
  abilityToSaveNew: boolean;
  symbol: string;
}

export default function ResultButtonGroup({
  saveResult,
  saveAsPDF,
  abilityToSaveNew,
  symbol,
}: ResultButtonGroupProps) {
  const [newResultModalOpen, setNewResultModalOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-between text-sm">
      {abilityToSaveNew && (
        <button
          className="flex gap-x-1 items-center p-2 m-1 tracking-tight bg-slate-500 hover:bg-slate-900 rounded-md text-white font-extralight"
          onClick={() => setNewResultModalOpen(true)}
        >
          <FiSave />
          save to my results
        </button>
      )}
      <div className="border-r-2 mx-2 border-black/60"></div>

      {newResultModalOpen && (
        <NewResultModal
          onSuccess={saveResult}
          closeModal={() => setNewResultModalOpen(false)}
          symbol={symbol}
        />
      )}

      {!isFirefox && (
        <button
          className="flex gap-x-2 items-center p-2 m-1 tracking-tight bg-slate-600 hover:bg-slate-900 text-white rounded-md"
          onClick={saveAsPDF}
        >
          <FiDownload /> download PDF
        </button>
      )}
    </div>
  );
}
