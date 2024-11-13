// react imports
import { useState } from 'react';

// wasp imports
import { type Strategy } from 'wasp/entities';
import {
    getStrategies,
    useQuery
} from 'wasp/client/operations';

// my imports
import { StrategyDropDownContents } from './components/HomePageDD';
import { NewProjectModal } from '../playground/components/modals/Modals';

// icon imports
import { IoMdAddCircleOutline } from "react-icons/io";

export default function HomePage() {

    // off the bat, call the useQuery hook on the strategies database
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);

    // for the overarching new strategy modal, keep track of function handle and modal state
    const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

    return (
        <div className='flex flex-col justify-center gap-10'>
            <div className='lg:mt-10'>
                <div className='mx-auto max-w-7xl px-6 lg:px-8'>
                    <div className='mx-auto flex justify-between text-end'>
                        <h4 className='my-2 font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white'>
                            My <span className='text-purple-500'>Strategies</span>
                        </h4>
                        <button className='group hover:bg-gray-200 mr-6 gap-2 flex bg-gray-100 rounded-lg p-1 pr-3 dark:bg-gray-600 dark:border-2 dark:border-white'
                            onClick={() => setNewProjectModalOpen(true)}>
                            <IoMdAddCircleOutline size='3rem' className='text-purple-500 group-hover:rotate-6 group-hover:scale-110 duration-500' />
                            <span className='font-bold text-xl'>new</span>
                        </button>
                    </div>

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