import { useState } from 'react';
import { FiDelete, FiEdit, FiBookOpen } from 'react-icons/fi';
import { type Result } from 'wasp/entities';
import ResultPanel from '../../../playground/client/components/Result/ResultPanel';
import { FormInputProps } from '../../../playground/client/components/Editor/Dashboard';
import RenameResultModal from './Modals/RenameResultModal';
import DeleteResultModal from './Modals/DeleteResultModal';

export default function ResultDropDown({ result }: { result: Result }) {

    const [resultPanelOpen, setResultPanelOpen] = useState<boolean>(false);
    const formInputs = result.formInputs as unknown as FormInputProps;

    const [renameResultModalOpen, setRenameResultModalOpen] = useState<boolean>(false);
    const [deleteResultModalOpen, setDeleteResultModalOpen] = useState<boolean>(false);

    return (
        <>
            <div className='flex justify-between m-4 items-center p-2 rounded-lg bg-slate-100'>
                <div className='flex justify-between gap-x-2'>
                    <div className='tracking-tight text-xl'>
                        {result.name}
                    </div>
                    <div className='text-slate-400 text-sm'>
                        from strategy: {result.fromStrategyID}
                    </div>
                </div>
                <div className='flex justify-between gap-x-2 items-center'>
                    <button className='p-1 m-1 flex rounded-lg bg-white hover:shadow-lg items-center gap-x-2'
                        onClick={() => setResultPanelOpen(!resultPanelOpen)}>
                        view
                        <FiBookOpen />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'>
                        <FiEdit onClick={() => setRenameResultModalOpen(true)} />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'>
                        <FiDelete onClick={() => setDeleteResultModalOpen(true)} />
                    </button>
                    <div className='font-mono text-xs'>
                        saved: {result.createdAt.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {renameResultModalOpen && <RenameResultModal closeModal={() => setRenameResultModalOpen(false)} id={result.id} currResultName={result.name} />}
            {deleteResultModalOpen && <DeleteResultModal closeModal={() => setDeleteResultModalOpen(false)} id={result.id} />}

            {resultPanelOpen &&
                <div className="fixed inset-0 flex items-center overflow-y-auto justify-center z-50">
                    <div className="bg-white/70 w-full rounded-lg fixed inset-0"></div>
                    <div className="p-6 w-5/6 h-5/6 z-10 rounded-lg bg-white border-black border-2 overflow-y-auto">
                        <button onClick={() => setResultPanelOpen(false)} className='text-red-500 gap-x-1 hover:font-bold m-2 font-light text-lg justify-self-end flex items-center'>
                            close
                            <FiDelete />
                        </button>
                        <ResultPanel stockData={result.data} formInputs={formInputs} selectedStrategy={result.fromStrategyID} abilityToSaveNew={false}/>
                    </div>
                </div>
            }
        </>
    )

}