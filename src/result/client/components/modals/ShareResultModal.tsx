import { useState } from 'react';
import { shareResult } from 'wasp/client/operations';
import { TiDelete } from "react-icons/ti";
import useEnterKey from '../../../../client/hooks/useEnterKey';
import ModalLayout from '../../../../client/components/ModalLayout';
import { useQuery, getSharedWith } from 'wasp/client/operations';
import { GetSharedWithWithReceiver } from '../../../../shared/sharedTypes';

interface ShareResultModalProps {
    closeModal: () => void;
    id: string;
}

export default function ShareResultModal({ closeModal, id }: ShareResultModalProps) {

    const [errMsg, setErrMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const [currentlyInTimeout, setCurrentlyInTimeout] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0); // New state for tracking progress

    const { data: sharedWith, isLoading: isSharedWithLoading, error: sharedWithError } = useQuery(getSharedWith, {
        id: id,
    });

    const handleResultDelete = async () => {
        if (currentlyInTimeout) return;

        setErrMsg('');
        setShowSuccess(false); // Reset success state

        try {
            await shareResult({ email, resultID: id });

            // Only proceed to success if no errors occur
            setShowSuccess(true);
            setCurrentlyInTimeout(true);
            const timeoutDuration = 3000;
            let elapsedTime = 0;

            // Start interval to update the progress
            const progressInterval = setInterval(() => {
                elapsedTime += 50;
                setProgress((elapsedTime / timeoutDuration) * 100); // Update progress
                if (elapsedTime >= timeoutDuration) {
                    clearInterval(progressInterval); // Clear interval when timeout is complete
                }
            }, 50);

            // Set timeout to close the modal after 3 seconds
            setTimeout(() => {
                closeModal();
                setCurrentlyInTimeout(false);
            }, timeoutDuration);
        } catch (error: any) {
            setShowSuccess(false); // Ensure success message doesn't appear on error
            setErrMsg(error.message);
        }
    };

    useEnterKey(handleResultDelete);

    return (
        <ModalLayout closeModal={closeModal}>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold dark:text-white">Share your result with <span className='dark:text-blue-300'>another user</span>!</h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white' />
                </button>
            </div>
            <input
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded w-full mt-4"
                autoFocus
            />
            {isSharedWithLoading ? (
                <div>Loading...</div>
            ) : sharedWithError ? (
                <div>Error</div>
            ) : sharedWith.length > 0 ? (
                <div className="m-2 p-2 dark:text-white text-sm">
                    <div className="font-semibold my-2">Currently Shared With:</div>
                    <ul className="p-2">
                        {sharedWith.map((sharedWithEntry, index) => (
                            <li className="text-center text-sky-700 dark:text-blue-300" key={index}>{(sharedWithEntry as GetSharedWithWithReceiver).receiver.email ?? "unknown"}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                    onClick={closeModal}
                >
                    Cancel
                </button>
                <button
                    className="bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
                    onClick={handleResultDelete}
                >
                    Share
                </button>
            </div>
            {errMsg &&
                <div className='mt-4 rounded-md p-2 bg-red-200 tracking-tight font-bold text-black'>
                    {errMsg}
                </div>}
            {showSuccess &&
                <div className="mt-4 p-2 text-sky-800 font-extralight text-center dark:text-white">
                    Success! You've shared the result with {email}.
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
