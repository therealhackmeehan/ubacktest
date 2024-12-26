import { useEffect, useState } from 'react';
import { FiDelete, FiBookOpen } from 'react-icons/fi';
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { type Result } from 'wasp/entities';
import ResultPanel from '../../../playground/client/components/Result/ResultPanel';
import { FormInputProps } from '../../../playground/client/components/Editor/Dashboard';
import RenameResultModal from './Modals/RenameResultModal';
import DeleteResultModal from './Modals/DeleteResultModal';
import { getSpecificStrategy } from 'wasp/client/operations';
import SmallPlot from './SmallPlot';

export default function ResultDropDown({ result }: { result: Result }) {

    const [strategyName, setStrategyName] = useState<string>('...');
    const [ret, setRet] = useState<string>('N/A');

    useEffect(() => {
        const fetchStrategyName = async () => {

            const data: any = result.data;
            if (data && data.portfolio) {
                const first = data.portfolio[0];
                const last = data.portfolio[data.portfolio.length - 1];
                const retToSet = 100 * ((last - first) / first);
                if (retToSet) {
                    setRet(retToSet.toFixed(2) + '%');
                }
            }

            if (!result.fromStrategyID) {
                setStrategyName('(deleted)');
                return;
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

    return (
        <>
            <div className='flex justify-between m-4 items-center p-2 rounded-lg bg-slate-100 border-slate-200 border-2 hover:shadow-lg duration-700'>
                <div className='flex justify-between gap-x-3'>
                    <div className='tracking-tight text-xl font-semibold'>
                        {result.name}
                    </div>
                    <div className='text-xs border-l-2 border-black/40 px-2 bg-white'>
                        profit/loss: <span className='text-lg'>{ret}</span>
                    </div>
                    <div className='p-1'>
                        <SmallPlot data={result.data} />
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
                        <MdOutlineEdit onClick={() => setRenameResultModalOpen(true)} />
                    </button>
                    <button className='hover:text-slate-600 hover:scale-110'>
                        <MdDeleteOutline onClick={() => setDeleteResultModalOpen(true)} />
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
                    <div className="p-4 w-5/6 h-5/6 z-10 rounded-lg bg-white border-black border-2 overflow-y-auto">
                        <button onClick={() => setResultPanelOpen(false)} className='text-red-500 gap-x-1 hover:font-extrabold hover:text-red-400 font-bold text-lg justify-self-end flex items-center'>
                            close
                            <FiDelete />
                        </button>
                        <ResultPanel stockData={result.data} formInputs={formInputs} selectedStrategy={result.fromStrategyID} abilityToSaveNew={false} />
                        <div onClick={handleCopyToClipboard}>
                            <textarea className='w-full bg-slate-100 p-4 rounded-lg h-72 font-mono text-xs border-white border-1 resize-none hover:bg-slate-200'
                                value={result.code} readOnly />
                            <div className='text-xs text-center -translate-y-8'>
                                click to copy
                            </div>
                        </div>
                        <div className='tracking-tight font-bold text-end text-slate-300 text-lg -translate-y-4'>
                            Source Code
                        </div>
                    </div>
                </div>
            }
        </>
    )

}