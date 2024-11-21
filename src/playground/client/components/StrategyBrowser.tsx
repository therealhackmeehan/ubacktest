import type { Strategy } from "wasp/entities";

interface StrategyBrowserProps {
    selectedStrategy: string;
    setSelectedStrategy: (value: string) => void;
    strategies: Strategy[];
    isStrategiesLoading: boolean;
}

function StrategyBrowser({ selectedStrategy, setSelectedStrategy, strategies, isStrategiesLoading }: StrategyBrowserProps) {

    return (
        <div className="col-span-1 mb-4 overflow-auto rounded-md bg-purple-900">
            <h4 className="sticky top-0 pb-2 rounded-md bg-gray-800/40 font-bold border-b border-gray-500 text-end text-lg tracking-tight p-2 text-white dark:text-white">
                Strategies
            </h4>

            {isStrategiesLoading && (
                <div className="text-xl font-extrabold p-4 text-white">Loading...</div>
            )}

            {strategies ? (
                <ul>
                    {strategies.map((strategy) => (
                        <li
                            key={strategy.id}
                            className={`flex pl-2 pb-1 pr-2 ${strategy.id === selectedStrategy ? "bg-gray-800" : "hover:bg-gray-800"
                                }`}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedStrategy(strategy.id)}
                                className="w-full truncate text-start hover:tracking-tight text-white hover:font-extrabold"
                            >
                                <div className="flex pt-1 tracking-tight text-xs font-extrabold">
                                    {strategy.name}
                                    {(strategy.id === selectedStrategy) &&
                                        (<div className="pl-2 w-full text-end font-mono opacity-30">
                                            {`${strategy.updatedAt.toLocaleDateString()}`}
                                        </div>)}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex tracking-tight text-white p-4 text-xs font-extrabold">
                    No Strategies Found.
                </div>
            )}
        </div>

    )
}

export default StrategyBrowser;