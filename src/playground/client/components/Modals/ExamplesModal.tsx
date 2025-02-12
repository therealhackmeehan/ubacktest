import { TiDelete } from "react-icons/ti";
import { examples } from "../../../examples";
import ModalLayout from "../../../../client/components/ModalLayout";

interface ExamplesModalProps {
    onSuccess: (value: string) => void;
    closeModal: () => void;
}

export default function ExamplesModal({ onSuccess, closeModal }: ExamplesModalProps) {
    return (
        <ModalLayout>
            <div className='flex justify-between mb-4'>
                <h2 className="text-base text-sky-700 font-semibold">Import an Example <span className="text-slate-800">Strategy</span></h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                </button>
            </div>

            <div className='overflow-y-auto h-[70vh]'>
                {Object.keys(examples).map((category, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-700">{category}</h3>
                        {examples[category].map((example, idx) => (
                            <div key={idx}>
                                <button
                                    className="p-1 my-1 text-sm w-full rounded-lg bg-slate-100 hover:bg-slate-200 hover:-translate-x-1 duration-500"
                                    onClick={() => onSuccess(example.script)}>
                                    {example.name}
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="font-mono text-xs text-center mt-2">
                Please note that importing an example will completely erase any code that you may have attached to this strategy.
            </div>

            <div className="flex justify-center mt-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </div>
        </ModalLayout>
    );
};
