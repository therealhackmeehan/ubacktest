import { useState, useContext } from 'react';
import { validateNewName } from '../../scripts/modalHelpers';
import useEnterKey from '../../../../client/hooks/useEnterKey';
import ModalLayout from '../../../../client/components/ModalLayout';
import { TiDelete } from 'react-icons/ti';
import { StrategyContext } from '../../EditorPage';

interface NewProjectModalProps {
    onSuccess: (name: string) => Promise<void>;
    closeModal: () => void;
    symbol: string;
}

export default function NewResultModal({ onSuccess, closeModal, symbol }: NewProjectModalProps) {

    const currDate = new Date();
    const currDateString: string = currDate.toLocaleDateString().replaceAll('/', '_')
    const fullPlaceholderName = symbol + '_result_' + currDateString;

    const { hasSaved, setHasSaved } = useContext(StrategyContext);

    const [newResultName, setNewResultName] = useState<string>(fullPlaceholderName);
    const [errMsg, setErrMsg] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [currentlyInTimeout, setCurrentlyInTimeout] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0); // New state for tracking progress

    const handleNewResult = async () => {
        if (currentlyInTimeout) return;

        setErrMsg('');
        setShowSuccess(false); // Reset success state

        try {
            if (hasSaved) throw new Error("You have already saved this result.");

            validateNewName(newResultName); // This should throw an error if invalid
            await onSuccess(newResultName); // Ensure success before showing success UI

            setShowSuccess(true);
            setCurrentlyInTimeout(true);
            const timeoutDuration = 3000;
            let elapsedTime = 0;

            // Start interval to update the progress
            const progressInterval = setInterval(() => {
                elapsedTime += 50;
                setProgress((elapsedTime / timeoutDuration) * 100);
                if (elapsedTime >= timeoutDuration) {
                    clearInterval(progressInterval);
                }
            }, 50);

            setHasSaved(true);

            // Set timeout to close the modal after 3 seconds
            setTimeout(() => {
                closeModal();
                setCurrentlyInTimeout(false);
            }, timeoutDuration);
        } catch (error: any) {
            setErrMsg(error.message);
            setShowSuccess(false); // Ensure success message is removed on error
        }
    };


    useEnterKey(handleNewResult);

    return (
        <ModalLayout>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold dark:text-white">Save Result <span className="text-slate-800 dark:text-blue-300">To My Results</span></h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white' />
                </button>
            </div>
            <input
                type="text"
                placeholder="Enter result name"
                value={newResultName}
                onChange={(e) => setNewResultName(e.target.value)}
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
                    onClick={handleNewResult}
                >
                    Confirm
                </button>
            </div>
            {errMsg &&
                <div className='mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-black'>
                    {errMsg}
                </div>}
            {showSuccess &&
                <div className="mt-4 p-2 text-sky-800 font-bold text-center dark:text-white">
                    Success! You can find your saved result on your results page.
                </div>}
            {currentlyInTimeout && (
                <div className="mt-4">
                    <div className="h-2 bg-gray-300 rounded-full">
                        <div className="h-full bg-sky-700/50 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}
        </ModalLayout>
    );
};
