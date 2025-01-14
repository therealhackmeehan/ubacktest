import { getSpecificStrategy } from "wasp/client/operations";
import { useParams } from "react-router-dom";
import { Link } from "wasp/client/router"
import { useQuery } from "wasp/client/operations";

import StrategyOverview from "./components/StrategyOverview";
import StrategyPreview from "./components/StrategyPreview";
import StrategyResults from "./components/results/StrategyResults";
import StrategyCodeGen from "./components/StrategyCodeGen";
import ContentWrapper from "../client/components/ContentWrapper";
import LoadingScreen from "../client/components/LoadingScreen";

function StrategyPage() {
    const { id } = useParams<'id'>();
    const { data: strategy, isLoading: isStrategyLoading, error: getStrategyError } = useQuery(getSpecificStrategy, {
        id: id
    });

    if (isStrategyLoading) return <LoadingScreen />

    if (!strategy || getStrategyError || !id) {
        return <ContentWrapper>
            <div className="mt-18 py-24 px-2 font-bold tracking-tight text-center text-2xl rounded-md bg-slate-100">
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
        <div className="bg-gradient-to-b from-slate-200 border-t-2 border-black">
            <div className="mx-auto max-w-7xl">
                <div className="mx-4 p-8">
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
