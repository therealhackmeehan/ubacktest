import { useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { type Result } from 'wasp/entities';
import { FormInputProps, StrategyResultProps } from '../../../../shared/sharedTypes';
import RenameResultModal from './modals/RenameResultModal';
import DeleteResultModal from './modals/DeleteResultModal';
import SmallPlot from './SmallPlot';
import OpenResult from './OpenResult';

export default function ResultListItem({ result }: { result: Result }) {

    const formInputs = result.formInputs as unknown as FormInputProps;
    const [resultPanelOpen, setResultPanelOpen] = useState<boolean>(false);

    const [renameResultModalOpen, setRenameResultModalOpen] = useState<boolean>(false);
    const [deleteResultModalOpen, setDeleteResultModalOpen] = useState<boolean>(false);

    return (
        <>
            <div className='flex justify-between my-3 mx-1 items-center p-2 rounded-lg bg-slate-100 border-slate-200 border-2 hover:shadow-lg duration-700'>
                <div className='flex justify-between gap-x-3'>
                    <div className='tracking-tight text-xl font-semibold'>
                        {result.name}
                    </div>
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
                <div className='flex justify-between gap-x-2 items-center'>
                    <button className='px-3 py-1 flex rounded-lg bg-white hover:shadow-lg items-center gap-x-2'
                        onClick={() => setResultPanelOpen(!resultPanelOpen)}>
                        view
                        <FiBookOpen />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'>
                        <MdOutlineEdit onClick={() => setRenameResultModalOpen(true)} />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'>
                        <MdDeleteOutline onClick={() => setDeleteResultModalOpen(true)} />
                    </button>
                    <div className='font-mono text-xs'>
                        saved: {result.createdAt.toLocaleString()}
                    </div>
                </div>
            </div>

            {renameResultModalOpen && <RenameResultModal closeModal={() => setRenameResultModalOpen(false)} id={result.id} currResultName={result.name} />}
            {deleteResultModalOpen && <DeleteResultModal closeModal={() => setDeleteResultModalOpen(false)} id={result.id} />}

            {resultPanelOpen && <OpenResult formInputs={formInputs} setResultPanelOpen={setResultPanelOpen} result={result} />}

        </>
    )

}