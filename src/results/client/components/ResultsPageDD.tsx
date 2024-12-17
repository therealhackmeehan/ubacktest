import { useEffect, useState } from 'react';
import { FiDelete, FiEdit, FiBookOpen } from 'react-icons/fi';
import { type Result } from 'wasp/entities';
import ResultPanel from '../../../playground/client/components/Result/ResultPanel';
import { FormInputProps } from '../../../playground/client/components/Editor/Dashboard';
import RenameResultModal from './Modals/RenameResultModal';
import DeleteResultModal from './Modals/DeleteResultModal';
import { getSpecificStrategy } from 'wasp/client/operations';

export default function ResultDropDown({ result }: { result: Result }) {

    const [strategyName, setStrategyName] = useState<string>('...');

    useEffect(() => {
        const fetchStrategyName = async () => {
            if (!result.fromStrategyID) {
                setStrategyName('deleted');
            } 
            const sName = await getSpecificStrategy({ id: result.fromStrategyID });
            if (sName) {
                setStrategyName(sName.name);
            }
        };

        fetchStrategyName();
    }, [result]);

    const handleCopyToClipboard = () => {
        if (result.code) {
            navigator.clipboard.writeText(result.code)
                .then(() => {
                    console.log('Code copied to clipboard!');
                    alert('code copied to clipboard.')
                })
                .catch(err => {
                    console.error('Failed to copy text to clipboard: ', err);
                });
        }
    };


    const [resultPanelOpen, setResultPanelOpen] = useState<boolean>(false);
    const formInputs = result.formInputs as unknown as FormInputProps;

    const [renameResultModalOpen, setRenameResultModalOpen] = useState<boolean>(false);
    const [deleteResultModalOpen, setDeleteResultModalOpen] = useState<boolean>(false);

    useEffect

    return (
        <>
            <div className='flex justify-between m-4 items-center p-2 rounded-lg bg-slate-100'>
                <div className='flex justify-between gap-x-2'>
                    <div className='tracking-tight text-xl'>
                        {result.name}
                    </div>
                    <div className='text-slate-400 text-xs'>
                        from strategy:
                        <span className='font-mono mx-1'>{strategyName}</span>
                    </div>
                </div>
                <div className='flex justify-between gap-x-2 items-center'>
                    <button className='px-3 py-1 flex rounded-lg bg-white hover:shadow-lg items-center gap-x-2'
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
                        <button onClick={() => setResultPanelOpen(false)} className='text-red-500 gap-x-1 hover:font-extrabold hover:text-red-400 m-2 font-bold text-lg justify-self-end flex items-center'>
                            close
                            <FiDelete />
                        </button>
                        <ResultPanel stockData={result.data} formInputs={formInputs} selectedStrategy={result.fromStrategyID} abilityToSaveNew={false} />
                        <div className='mb-12' onClick={handleCopyToClipboard}>
                            <textarea className='w-full bg-slate-100 p-4 rounded-lg h-72 font-mono text-xs border-white border-1 resize-none hover:bg-slate-200'
                                value={result.code} readOnly />
                            <div className='text-xs text-center -translate-y-8'>
                                click to copy
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )

}