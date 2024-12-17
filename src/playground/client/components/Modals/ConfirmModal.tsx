import useEnterKey from "../../../../client/hooks/useEnterKey";

interface ConfirmModalProps {
    msg: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ msg, onConfirm, onCancel}: ConfirmModalProps) {

    useEnterKey(onConfirm);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                <div className='flex justify-between'>
                    <h2 className="text-base text-slate-500 font-semibold">{msg}</h2>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                        onClick={onCancel}
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
            </div>
        </div>
    );
};
