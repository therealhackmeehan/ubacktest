import PageHeader from "./components/PageHeader"
import StrategyBrowser from "./components/StrategyBrowser"
import Editor from "./components/Editor"
import { useState, useEffect, useRef } from "react"
import { getSpecificStrategy, getStrategies, useQuery } from "wasp/client/operations"

export default function Layout() {

    // strategy to focus in on or display
    const [selectedStrategy, setSelectedStrategy] = useState<string>('');

    // contents to display along the strategy in focus
    const [nameToDisplay, setNameToDisplay] = useState<string>('');
    const [codeToDisplay, setCodeToDisplay] = useState<string>('');

    // strategy database contents
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies)
    const hasLoadedInitialData = useRef(false); // To track whether we've already loaded the data

    // Initial load of strategies --------
    useEffect(() => {
        const loadInitialData = async () => {
            if (!hasLoadedInitialData.current && !isStrategiesLoading) {
                
                hasLoadedInitialData.current = true; // Mark the initial load as complete

                const savedValue = localStorage.getItem('projectToLoad');
                if (savedValue) {
                    setSelectedStrategy(savedValue);
                    localStorage.setItem('projectToLoad', ''); // Clear local storage once data is loaded
                } else if (strategies.length > 0) {
                    setSelectedStrategy(strategies[0].id)
                } else {
                    setSelectedStrategy('')
                }
            }
        };

        loadInitialData(); // Call the async function

    }, [strategies, isStrategiesLoading]); // Only trigger this when the strategies array or isStrategiesLoading change

    const setNameAndCodeFromID = async (selectedValue: string) => {
        if (!hasLoadedInitialData.current) {
            return;
        }
        const strategy = await getSpecificStrategy({ id: selectedValue });
        if (strategy) {
            setNameToDisplay(strategy.name);
            setCodeToDisplay(strategy.code);
        }
    }

    // listen for an update in selected strategy
    useEffect(() => {
        setNameAndCodeFromID(selectedStrategy);
    }, [selectedStrategy]);

    return (
        <div className='flex flex-col justify-center gap-10'>
            <div className='mt-10'>
                <div className='mx-auto'>

                    <PageHeader setSelectedStrategy={setSelectedStrategy}/>

                    <div className="lg:grid lg:grid-cols-6 gap-3">
                        
                        <StrategyBrowser 
                            selectedStrategy={selectedStrategy}
                            setSelectedStrategy={setSelectedStrategy}
                            strategies={strategies} 
                            isStrategiesLoading={isStrategiesLoading}/>

                        <Editor 
                            nameToDisplay={nameToDisplay}
                            codeToDisplay={codeToDisplay}
                            selectedStrategy={selectedStrategy}
                            setNameToDisplay={setNameToDisplay}
                            setCodeToDisplay={setCodeToDisplay}
                            setSelectedStrategy={setSelectedStrategy} />

                    </div>

                </div>
            </div>
        </div>
    )
}