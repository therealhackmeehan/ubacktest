import type { Strategy } from "wasp/entities";
import StrategyBrowser from "./components/StrategyBrowser"
import StrategyEditor from "./components/StrategyEditor"
import { useState, useEffect, useRef, createContext } from "react"
import { getSpecificStrategy, getStrategies, useQuery } from "wasp/client/operations"

// store name and code in context instead of prop drilling 
export interface StrategyContextProps {
    selectedStrategy: Strategy;
    setSelectedStrategy: (value: Strategy) => void;
}

// export const StrategyContext = createContext<StrategyContextProps>({
//     selectedStrategy: null,
//     setSelectedStrategy: () => (),
// });

export const StrategyContext = createContext<any>(null);

export default function EditorPage() {

    // strategy to focus in on or display
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

    // strategy database contents
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);
    const hasLoadedInitial = useRef(false); // To track whether we've already loaded the data

    useEffect(() => {
        const loadInitialData = async () => {

            if (!hasLoadedInitial.current && !isStrategiesLoading) {
                hasLoadedInitial.current = true; // Mark the initial load as complete
                const savedValue = localStorage.getItem('projectToLoad');

                if (savedValue) {
                    localStorage.setItem('projectToLoad', ''); // Clear local storage once data is loaded
                    const fromSaved = await getSpecificStrategy({ id: savedValue });
                    if (fromSaved) setSelectedStrategy(fromSaved);
                    return;
                } else if (strategies) {
                    setSelectedStrategy(strategies[0])
                    return;
                }

                setSelectedStrategy(null)
            }
        };

        loadInitialData(); // Call the async function

    }, [strategies, isStrategiesLoading]);

    return (

        <div className='grid-cols-12 grid h-[92vh] border-black border-t-2'>

            <div className="col-span-2 h-full overflow-x-auto overflow-y-auto bg-gray-50 border-r-2 border-black">
                <StrategyBrowser
                    strategies={strategies}
                    isStrategiesLoading={isStrategiesLoading}
                    selectedStrategy={selectedStrategy}
                    setSelectedStrategy={setSelectedStrategy} />
            </div>

            <div className='col-span-10 h-full overflow-x-hidden overflow-y-auto'>
                {selectedStrategy ? (
                    <StrategyContext.Provider value={{ selectedStrategy, setSelectedStrategy }}>
                        <StrategyEditor />
                    </StrategyContext.Provider>
                ) : (
                    <NoStrategiesBanner isStrategiesLoading={isStrategiesLoading} />
                )}
            </div>

        </div >
    )
}

function NoStrategiesBanner({ isStrategiesLoading }: { isStrategiesLoading: boolean }) {
    return (
        <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">
            {isStrategiesLoading ? "Loading..." : "No Strategies Exist (yet)"}
        </div>
    )
}