import { useState } from 'react';
import { type Strategy } from 'wasp/entities';
import {
    getStrategies,
    useQuery
} from 'wasp/client/operations';

import { StrategyDropDownContents } from './components/HomePageDD';
import { NewProjectModal } from '../../playground/client/components/Modals/Modals';
import { IoMdAddCircleOutline } from "react-icons/io";

export default function HomePage() {

    // off the bat, call the useQuery hook on the strategies database
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);

    // for the overarching new strategy modal, keep track of function handle and modal state
    const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

    return (
        <div className='mt-12 flex flex-col max-w-7xl mx-auto rounded-lg'>
            <div>
                <div className='mx-auto max-w-7xl px-6 lg:px-8'>
                    <div className='mx-auto flex justify-between text-end'>
                        <h4 className='my-2 font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white'>
                            My <span className='text-slate-500'>Strategies</span>
                        </h4>
                        <button className='group bg-slate-100 mr-6 gap-2 flex border-2 border-black rounded-lg p-1 pr-3 dark:bg-gray-600 dark:border-2 dark:border-white'
                            onClick={() => setNewProjectModalOpen(true)}>
                            <IoMdAddCircleOutline size='3rem' className='text-slate-500 group-hover:rotate-6 group-hover:scale-110 duration-500' />
                            <span className='font-bold text-xl'>new</span>
                        </button>
                    </div>
                    <div className='border-b-2 w-5/6 border-slate-400'></div>

                    {newProjectModalOpen && <NewProjectModal
                        onSuccess={() => setNewProjectModalOpen(false)}
                        onFailure={() => setNewProjectModalOpen(false)}
                    />}

                    <div className='mt-12 space-y-4'>
                        {isStrategiesLoading ?
                            <div className='mx-auto text-2xl'>Loading...</div>
                            : (
                                strategies.length > 0 ? (
                                    <ul>
                                        {strategies.map((strategy: Strategy) => (
                                            <StrategyDropDownContents strategy={strategy} />
                                        ))}
                                    </ul>
                                ) : (
                                    <div className='text-2xl'>No strategies found. Create one now!</div>
                                ))}
                    </div>
                </div>
            </div>
        </div>
    );
}