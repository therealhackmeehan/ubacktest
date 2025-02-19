import { useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { GoShare } from "react-icons/go";
import { type Result } from 'wasp/entities';
import { FormInputProps } from '../../../shared/sharedTypes';
import RenameResultModal from './modals/RenameResultModal';
import DeleteResultModal from './modals/DeleteResultModal';
import OpenResult from './OpenResult';
import { togglePrivacy } from 'wasp/client/operations';
import ShareResultModal from './modals/ShareResultModal';
import { RxLockOpen2, RxLockClosed } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ResultHeader from './ResultHeader';

export default function ResultListItem({ result }: { result: Result }) {

    const formInputs = result.formInputs as unknown as FormInputProps;
    const [resultPanelOpen, setResultPanelOpen] = useState<boolean>(false);

    const [renameResultModalOpen, setRenameResultModalOpen] = useState<boolean>(false);
    const [deleteResultModalOpen, setDeleteResultModalOpen] = useState<boolean>(false);
    const [shareResultModalOpen, setShareResultModalOpen] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [isPublic, setIsPublic] = useState<boolean>(result.public);

    async function togglePublicPrivate() {
        if (loading) return;

        setLoading(true);

        try {
            const r = await togglePrivacy({ id: result.id });
            if (!r) return;

            setIsPublic(r.public);
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className='md:flex justify-between my-6 md:my-3 md:mx-1 items-center p-2 rounded-lg bg-slate-100 border-slate-200 border-2 hover:shadow-lg duration-700 dark:border-0 dark:bg-boxdark dark:shadow-none'>
                <ResultHeader result={result} setResultPanelOpen={setResultPanelOpen} />
                <div className='flex justify-between gap-x-3 items-center dark:text-white'>
                    <button className='px-3 py-1 flex rounded-lg bg-white hover:shadow-lg items-center gap-x-2 dark:bg-boxdark-2 dark:border-2 dark:border-blue-300'
                        onClick={() => setResultPanelOpen(!resultPanelOpen)}>
                        view
                        <FiBookOpen />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'
                        onClick={() => setShareResultModalOpen(true)}>
                        <GoShare />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'
                        onClick={togglePublicPrivate}>
                        {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : (isPublic ? <RxLockOpen2 /> : <RxLockClosed />)}
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'
                        onClick={() => setRenameResultModalOpen(true)}>
                        <MdOutlineEdit />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'
                        onClick={() => setDeleteResultModalOpen(true)}>
                        <MdDeleteOutline />
                    </button>
                    <div className='font-mono text-xs dark:text-blue-300'>
                        saved: {result.createdAt.toLocaleString()}
                    </div>
                </div>
            </div>

            {shareResultModalOpen && <ShareResultModal closeModal={() => setShareResultModalOpen(false)} id={result.id} />}
            {renameResultModalOpen && <RenameResultModal closeModal={() => setRenameResultModalOpen(false)} id={result.id} currResultName={result.name} />}
            {deleteResultModalOpen && <DeleteResultModal closeModal={() => setDeleteResultModalOpen(false)} id={result.id} />}

            {resultPanelOpen && <OpenResult formInputs={formInputs} setResultPanelOpen={setResultPanelOpen} result={result} />}

        </>
    )

}