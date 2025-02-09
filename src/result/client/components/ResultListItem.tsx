import { useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { GoShare } from "react-icons/go";
import { type Result } from 'wasp/entities';
import { FormInputProps, StrategyResultProps } from '../../../shared/sharedTypes';
import RenameResultModal from './modals/RenameResultModal';
import DeleteResultModal from './modals/DeleteResultModal';
import SmallPlot from './SmallPlot';
import OpenResult from './OpenResult';
import LoadingScreen from '../../../client/components/LoadingScreen';
import { togglePrivacy } from 'wasp/client/operations';
import ShareResultModal from './modals/ShareResultModal';
import { RxLockOpen2, RxLockClosed } from "react-icons/rx";

export default function ResultListItem({ result }: { result: Result }) {

    const formInputs = result.formInputs as unknown as FormInputProps;
    const [resultPanelOpen, setResultPanelOpen] = useState<boolean>(false);

    const [renameResultModalOpen, setRenameResultModalOpen] = useState<boolean>(false);
    const [deleteResultModalOpen, setDeleteResultModalOpen] = useState<boolean>(false);
    const [shareResultModalOpen, setShareResultModalOpen] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [isPublic, setIsPublic] = useState<boolean>(result.public);

    async function togglePublicPrivate() {
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
            {loading && <LoadingScreen />}
            <div className='flex justify-between my-3 mx-1 items-center p-2 rounded-lg bg-slate-100 border-slate-200 border-2 hover:shadow-lg duration-700'>
                <ResultHeader result={result} setResultPanelOpen={setResultPanelOpen} />
                <div className='flex justify-between gap-x-3 items-center'>
                    <button className='px-3 py-1 flex rounded-lg bg-white hover:shadow-lg items-center gap-x-2'
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
                        {isPublic ? <RxLockOpen2 /> : <RxLockClosed />}
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'
                        onClick={() => setRenameResultModalOpen(true)}>
                        <MdOutlineEdit />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'
                        onClick={() => setDeleteResultModalOpen(true)}>
                        <MdDeleteOutline />
                    </button>
                    <div className='font-mono text-xs'>
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

interface ResultHeaderProps {
    result: Result;
    setResultPanelOpen: (val: boolean) => void;

}
export function ResultHeader({ result, setResultPanelOpen }: ResultHeaderProps) {
    return (
        <div className='flex justify-between gap-x-3'>
            <button className='tracking-tight text-xl font-semibold hover:text-sky-700' onClick={() => setResultPanelOpen(true)}>
                {result.name}
            </button>
            <div className='text-xs border-l-2 border-black/40 px-2 bg-white'>
                profit/loss: <span className='text-lg'>{result.profitLoss.toFixed(2)}%</span>
            </div>
            {result.data ?
                <div className='p-1'>
                    <SmallPlot data={result.data as unknown as StrategyResultProps} />
                </div>
                :
                // for really large strategies, data is not stored but the api is called if clicked on.
                <div className='text-xs tracking-tight p-1 font-extralight lowercase'>Open to view plot.</div>
            }
        </div>
    )
}