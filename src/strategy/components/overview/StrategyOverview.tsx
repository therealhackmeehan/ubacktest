import { Strategy } from "wasp/entities";

function StrategyOverview({ strategy }: { strategy: Strategy }) {
    return (
        <>
            <div className="flex justify-between items-end m-2">
                <div className="text-6xl tracking-tight font-bold">
                    <span className="text-sm mr-3 text-sky-600">strategy</span>{strategy.name}<span className="text-sky-600">.</span>
                </div>
                <div className="text-end font-light">
                    <div>
                        created: {strategy.createdAt.toLocaleString()}
                    </div>
                    <div>
                        last updated: {strategy.updatedAt.toLocaleString()}
                    </div>
                </div>
            </div>
            <div className="border-2 border-slate-200 my-2"></div>
        </>
    )
}

export default StrategyOverview;