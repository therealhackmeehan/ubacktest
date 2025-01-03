import { useQuery } from "wasp/client/operations";
import { getStrategies } from "wasp/client/operations";

interface DeployStrategyBrowserProps {
    selectedStrategy: string;
    setSelectedStrategy: (value: string) => void;
}

export default function DeployStrategyBrowser({ selectedStrategy, setSelectedStrategy }: DeployStrategyBrowserProps) {

    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);

    return (
        <div className="col-span-2 h-full bg-slate-100 overflow-auto">
            <div className="text-center font-bold text-sm tracking-tight p-2">My Strategies</div>
            {isStrategiesLoading && (
                <div className="text-xl font-extrabold p-4 text-white">Loading...</div>
            )}

            <ul>
                {strategies &&
                    (<>
                        {strategies.map((strategy) => (
                            <li
                                key={strategy.id}
                                className={`flex pl-2 pb-1 pr-2 ${strategy.id === selectedStrategy ? "bg-sky-100" : "hover:bg-sky-100"
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
            </ul>
        </div>

    )
}