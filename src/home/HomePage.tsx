import { useState } from 'react';
import { type Strategy } from 'wasp/entities';
import {
    getStrategies,
    useQuery
} from 'wasp/client/operations';

import { StrategyDropDown } from './HomePageDD';
import { IoMdAddCircleOutline } from "react-icons/io";
import NewProjectModal from '../playground/client/components/modals/NewProjectModal';
import ContentWrapper from '../client/components/ContentWrapper';
import LoadingScreen from '../client/components/LoadingScreen';

export default function HomePage() {

    // off the bat, call the useQuery hook on the strategies database
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);

    // for the overarching new strategy modal, keep track of function handle and modal state
    const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

    return (
        <ContentWrapper>
            <div className='flex justify-between'>
                <h4 className='my-2 font-bold tracking-tight text-gray-900 text-3xl dark:text-white'>
                    My <span className='text-sky-700 dark:text-blue-300'>Strategies</span>
                </h4>
                <button className='group bg-slate-100 flex border-2 border-black rounded-lg p-1 dark:bg-boxdark-2 dark:border-0'
                    onClick={() => setNewProjectModalOpen(true)}>
                    <IoMdAddCircleOutline size='3rem' className='text-slate-500 group-hover:rotate-6 group-hover:scale-110 duration-500 dark:text-white' />
                    <span className='font-bold p-1 text-xl text-sky-700 dark:text-blue-300'>new</span>
                </button>
            </div>
            <div className='hidden md:flex border-b-2 w-5/6 border-slate-400'></div>

            {newProjectModalOpen && <NewProjectModal
                onSuccess={() => setNewProjectModalOpen(false)}
                closeModal={() => setNewProjectModalOpen(false)}
            />}

            <div className="mt-12">
                {isStrategiesLoading ? (
                    <LoadingScreen />
                ) : strategies && strategies.length > 0 ? (
                    <ul>
                        {strategies.map((strategy: Strategy) => (
                            <StrategyDropDown key={strategy.id} strategy={strategy} />
                        ))}
                    </ul>
                ) : (
                    <div className='dark:text-white'>No strategies found. Create one now!</div>
                )}
            </div>
        </ContentWrapper>
    );
}