import type { Strategy } from "wasp/entities";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import NewProjectModal from "./Modals/NewProjectModal";

interface StrategyBrowserProps {
    selectedStrategy: string;
    setSelectedStrategy: (value: string) => void;
    strategies: Strategy[];
    isStrategiesLoading: boolean;
}

function StrategyBrowser({ selectedStrategy, setSelectedStrategy, strategies, isStrategiesLoading }: StrategyBrowserProps) {

    const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

    function onSuccessfulNewProject(id: string) {
        setSelectedStrategy(id);
        setNewProjectModalOpen(false);
    }

    return (
        <div className="overflow-y-auto h-full col-span-1 bg-gray-50 border-r-2 border-black">

            {isStrategiesLoading && (
                <div className="text-xl font-extrabold p-4 text-white">Loading...</div>
            )}

            <ul>

                {strategies &&

                    (<>
                        {strategies.map((strategy) => (
                            <li
                                key={strategy.id}
                                className={`flex pl-2 pb-1 pr-2 ${strategy.id === selectedStrategy ? "bg-gray-100" : "hover:bg-gray-100"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedStrategy(strategy.id)}
                                    className="flex pt-1 w-full tracking-tight text-sm font-light"
                                >
                                    {strategy.name}
                                    {(strategy.id === selectedStrategy) &&
                                        (<div className="pl-2 text-end font-mono items-center opacity-30">
                                            {`${strategy.updatedAt.toLocaleDateString()}`}
                                        </div>)}
                                </button>
                            </li>
                        ))}
                    </>)}

                <button className='justify-between items-center gap-x-2 border-2 flex border-gray-800/30 rounded-lg px-8 my-4 justify-self-center hover:bg-gray-200/40'
                    onClick={() => setNewProjectModalOpen(true)}>
                    <span className='font-bold text-gray-800 text-lg'>new</span>
                    <FaPlus />
                </button>

                {newProjectModalOpen && <NewProjectModal
                    onSuccess={onSuccessfulNewProject}
                    onFailure={() => setNewProjectModalOpen(false)}
                />}

            </ul>
        </div>

    )
}

export default StrategyBrowser;