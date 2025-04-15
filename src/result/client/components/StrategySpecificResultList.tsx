import { ResultWithStrategyName } from "../../../playground/server/resultOperations";
import { useEffect, useState } from "react";
import ResultListItem from "./ResultListItem";
import GroupedResultsSummary from "./GroupedResultSummary";

interface StrategySpecificResultListProps {
    strategyId: string;
    resultsByStrategy: ResultWithStrategyName[];
    resultToHighlight: string;
    setResultToHighlight: (val: string) => void;
}

export default function StrategySpecificResultList({
    strategyId,
    resultsByStrategy,
    resultToHighlight,
    setResultToHighlight
}: StrategySpecificResultListProps) {
    const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Avoid resetting if already selected something manually
        if (selectedResults.size === 0) {
            const allIds = new Set(resultsByStrategy.map(r => r.id));
            setSelectedResults(allIds);
        }
    }, [resultsByStrategy]);

    const toggleResultSelection = (id: string) => {
        setSelectedResults(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                // Only allow deselection if more than one item is currently selected
                if (newSet.size > 2) {
                    newSet.delete(id);
                }
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectedResultItems = resultsByStrategy.filter(r => selectedResults.has(r.id));

    return (
        <div key={strategyId} className="mb-4 lg:mb-8">
            <GroupedResultsSummary
                resultsByStrategy={selectedResultItems}
                setResultToHighlight={setResultToHighlight}
            />
            <ul className="space-y-2 my-3">
                {resultsByStrategy.map(({ strategyName, ...rest }) => (
                    <li key={rest.id}>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedResults.has(rest.id)}
                                onChange={() => toggleResultSelection(rest.id)}
                                className="mr-2 bg-slate-100 text-black"
                            />
                            <div className="flex-1">
                                <ResultListItem
                                    result={rest}
                                    highlight={rest.id === resultToHighlight}
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
