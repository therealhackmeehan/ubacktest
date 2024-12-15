import { TiDelete } from "react-icons/ti";
import { examples } from "../../../examples";

interface ExamplesModalProps {
    onSuccess: (value: string) => void;
    closeModal: () => void;
}

export default function ExamplesModal({ onSuccess, closeModal }: ExamplesModalProps) {

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-base text-slate-500 font-semibold">Import an Example <span className="text-slate-800">Strategy</span></h2>
                    <button onClick={closeModal}>
                        <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110' />
                    </button>
                </div>

                <div className='h-72'>
                    {examples.map((example, index) => (
                        <div>
                            <button key={index}
                                className="overflow-y-auto p-1 my-1 text-sm w-full rounded-lg bg-slate-100 hover:bg-slate-200 hover:-translate-x-1 duration-500"
                                onClick={() => onSuccess(example.script)}>
                                {example.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="font-mono text-xs text-center">
                    please note that importing an example will completely erase any code that you may have attached to this strategy.
                </div>

                <div className="flex justify-self-center mt-4">
                    <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )

}