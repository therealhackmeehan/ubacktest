import type { Strategy } from "wasp/entities";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import NewProjectModal from "./modals/NewProjectModal";

export interface StrategyBrowserProps {
    selectedStrategy: Strategy | null;
    setSelectedStrategy: (value: Strategy) => void;
    strategies: Strategy[] | null | undefined;
    isStrategiesLoading: boolean;
}

function StrategyBrowser({ selectedStrategy, setSelectedStrategy, strategies, isStrategiesLoading }: StrategyBrowserProps) {

    const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

    function onSuccessfulNewProject(s: Strategy) {
        setSelectedStrategy(s);
        setNewProjectModalOpen(false);
    }

    return (
        <>

            {isStrategiesLoading && (
                <div className="text-xl font-extrabold p-4 text-white">Loading...</div>
            )}

            <ul>
                {(strategies && strategies !== undefined && selectedStrategy) &&
                    (<>
                        {strategies.map((strategy) => (
                            <li
                                key={strategy.id}
                                className={`flex pl-2 pb-1 pr-2 ${strategy.id === selectedStrategy.id ? "bg-sky-100" : "hover:bg-sky-100"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedStrategy(strategy)}
                                    className="flex pt-1 w-full tracking-tight text-sm font-light"
                                >
                                    {strategy.name}
                                    {(strategy.id === selectedStrategy.id) &&
                                        (<div className="pl-2 text-end font-mono items-center opacity-30">
                                            {`${strategy.updatedAt.toLocaleDateString()}`}
                                        </div>)}
                                </button>
                            </li>
                        ))}
                    </>)}

                <button className='justify-between items-center gap-x-2 border-2 flex bg-sky-700 border-black rounded-lg px-8 mt-4 mb-12 justify-self-center hover:bg-sky-600'
                    onClick={() => setNewProjectModalOpen(true)}>
                    <span className='font-bold text-white text-lg'>new</span>
                    <FaPlus className="text-white"/>
                </button>

                {newProjectModalOpen && <NewProjectModal
                    onSuccess={onSuccessfulNewProject}
                    closeModal={() => setNewProjectModalOpen(false)}
                />}

            </ul>
        </>

    )
}

export default StrategyBrowser;