import type { Strategy } from "wasp/entities";
import { getSpecificStrategy } from "wasp/client/operations";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "wasp/client/auth";

import StrategyOverview from "./components/overview/StrategyOverview";
import StrategyPreview from "./components/preview/StrategyPreview";
import StrategyResults from "./components/results/StrategyResults";
import StrategyCodeGen from "./components/codegen/StrategyCodeGen";
import ContentWrapper from "../client/components/ContentWrapper";

function StrategyPage() {
    const { id } = useParams<'id'>();
    const { data: user } = useAuth();
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setError('Unauthorized access');
            return;
        }

        const fetchStrategy = async () => {
            try {
                if (!id) {
                    setError('No strategy ID provided');
                    return;
                }

                const s = await getSpecificStrategy({ id: id });

                if (!s) {
                    setError('That strategy could not be found');
                    return;
                }

                if (s.userId !== user.id) {
                    setError('You dont have permission to access this strategy');
                    return;
                }

                setStrategy(s);
            } catch (err) {
                setError('An error occurred while fetching the strategy');
            }
        };

        fetchStrategy();
    }, [user, id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!strategy) {
        return <div>Loading...</div>;
    }

    return (
        <ContentWrapper>
            <StrategyOverview strategy={strategy} />
            <StrategyPreview strategy={strategy} />
            <StrategyResults id={strategy.id} />
            <StrategyCodeGen code={strategy.code} />
        </ContentWrapper>
    );
}

export default StrategyPage;
