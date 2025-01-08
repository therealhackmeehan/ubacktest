import { useState, useEffect } from "react";
import DeployStrategyBrowser from "./components/DeployStrategyBrowser";
import { getSpecificStrategy } from "wasp/client/operations";
import DeployEditor from "./components/DeployEditor";
import ContentWrapper from "../../client/components/ContentWrapper";

export default function DeployPage() {

    const [selectedStrategy, setSelectedStrategy] = useState<string>('');
    const [codeToDisplay, setCodeToDisplay] = useState<string>('');

    const setCodeFromID = async (selectedValue: string) => {

        const strategy = await getSpecificStrategy({ id: selectedValue });
        if (strategy) {
            setCodeToDisplay(strategy.code || '');
        }
    }

    useEffect(() => {
        setCodeFromID(selectedStrategy);
    }, [selectedStrategy]);

    return (
        <ContentWrapper>
            <h4 className='my-2 rounded-full font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white'>
                Bring Your Strategy <span className='text-sky-600'>To Market</span>
            </h4>
            <div className='border-b-2 w-full border-slate-400'></div>

            <h4 className="m-6 p-4 font-bold text-end text-xl bg-slate-100 tracking-tight text-gray-900 dark:text-white border-slate-300 border-2 rounded-md">
                Generate code to deploy your strategy with real money.
            </h4>

            <div className="grid grid-cols-12 h-[65vh] my-8">
                <DeployStrategyBrowser selectedStrategy={selectedStrategy} setSelectedStrategy={setSelectedStrategy} />
                <DeployEditor codeToDisplay={codeToDisplay} />
            </div>
        </ContentWrapper>
    )

}