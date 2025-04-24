import { getSpecificStrategy, useQuery } from "wasp/client/operations";
import { useParams } from "react-router-dom";
import { Link } from "wasp/client/router"

import StrategyOverview from "./components/StrategyOverview";
import StrategyPreview from "./components/StrategyPreview";
import StrategyResults from "./components/StrategyResults";
import StrategyCodeGen from "./components/StrategyCodeGen";
import ContentWrapper from "../client/components/ContentWrapper";
import LoadingScreen from "../client/components/LoadingScreen";

export const miniEditorOpts = {
    readOnly: true,
    domReadOnly: true,
    selectionHighlight: false,
    lineHeight: 18,
    fontSize: 11,
    padding: {
        top: 12,
        bottom: 0
    }
}

function StrategyPage() {
    const { id } = useParams<'id'>();
    const { data: strategy, isLoading: isStrategyLoading, error: getStrategyError } = useQuery(getSpecificStrategy, {
        id: id || ''
    });

    if (isStrategyLoading) return <LoadingScreen />

    if (!strategy || getStrategyError || !id) {
        return <ContentWrapper>
            <div className="mt-18 py-24 px-2 font-bold tracking-tight text-center text-2xl rounded-md bg-slate-100 dark:bg-black dark:text-white">
                <div className="font-light m-1">You've stumbled into an error...</div>
                This likely means that the strategy doesn't exist or you don't have access to this strategy.
            </div>
            <div className="text-center my-6">
                <Link className="underline" to="/home">
                    Go back to my strategies.
                </Link>
            </div>
        </ContentWrapper>;
    }

    if (!strategy) {
        return <LoadingScreen />;
    }

    return (
        <div className="bg-gradient-to-b from-slate-100 to-white dark:from-boxdark dark:to-boxdark-2">
            <div className="mx-auto max-w-7xl">
                <div className="p-2 mx-1 md:mx-4 md:p-8">
                    <StrategyOverview strategy={strategy} />
                    <StrategyPreview strategy={strategy} />
                    <StrategyResults strategy={strategy} />
                    <StrategyCodeGen code={strategy.code} />
                </div>
            </div>
        </div>
    );
}

export default StrategyPage;
