import StrategyBrowser from "./components/StrategyBrowser"
import { useState, useEffect, useRef } from "react"
import { getSpecificStrategy, getStrategies, useQuery } from "wasp/client/operations"
import StrategyHeader from "./components/StrategyHeader"
import Dashboard from "./components/Editor/Dashboard"

export default function Layout() {

    // strategy to focus in on or display
    const [selectedStrategy, setSelectedStrategy] = useState<string>('');

    // contents to display along the strategy in focus
    const [nameToDisplay, setNameToDisplay] = useState<string>('');
    const [codeToDisplay, setCodeToDisplay] = useState<string>('');

    // strategy database contents
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);
    const hasLoadedInitial = useRef(false); // To track whether we've already loaded the data

    useEffect(() => {
        const loadInitialData = async () => {

            if (!hasLoadedInitial.current && !isStrategiesLoading) {
                hasLoadedInitial.current = true; // Mark the initial load as complete
                const savedValue = localStorage.getItem('projectToLoad');

                if (savedValue) {
                    setSelectedStrategy(savedValue);
                    localStorage.setItem('projectToLoad', ''); // Clear local storage once data is loaded
                } else if (strategies) {
                    setSelectedStrategy(strategies[0].id)
                } else {
                    setSelectedStrategy('')
                }
            }
        };

        loadInitialData(); // Call the async function

    }, [strategies, isStrategiesLoading]);

    const setNameAndCodeFromID = async (selectedValue: string) => {
        if (!hasLoadedInitial.current) {
            return;
        }
        const strategy = await getSpecificStrategy({ id: selectedValue });
        if (strategy) {
            setNameToDisplay(strategy.name);
            setCodeToDisplay(strategy.code || '');
        }
    }

    useEffect(() => {
        setNameAndCodeFromID(selectedStrategy);
    }, [selectedStrategy]);

    return (
        <>
            <div className='grid-cols-6 grid h-[92vh] border-black border-t-2'>

                <StrategyBrowser
                    selectedStrategy={selectedStrategy}
                    setSelectedStrategy={setSelectedStrategy}
                    strategies={strategies}
                    isStrategiesLoading={isStrategiesLoading} />

                <div className="col-span-5 h-full overflow-y-auto overflow-x-hidden">
                    {selectedStrategy ? (
                        <>
                            <StrategyHeader
                                nameToDisplay={nameToDisplay}
                                selectedStrategy={selectedStrategy}
                                setNameToDisplay={setNameToDisplay}
                                setSelectedStrategy={setSelectedStrategy} />

                            <Dashboard
                                codeToDisplay={codeToDisplay}
                                selectedStrategy={selectedStrategy}
                                setCodeToDisplay={setCodeToDisplay}
                            />
                        </>
                    ) : (
                        <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">No Strategies Exist (yet)</div>
                    )}
                </div>

            </div>
        </>
    )
}