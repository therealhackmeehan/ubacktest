import { Strategy } from "wasp/entities";

function StrategyOverview({ strategy }: { strategy: Strategy }) {
    return (
        <div>
            <p className="font-bold tracking-tight text-xl text-center">
                youre looking at a strategy lol
            </p>
            <p className="p-2 m-2 font-mono">
                Name: {strategy.name}
            </p>
            <p className="p-2 m-2 font-mono">
                ID: {strategy.id}
            </p>
            <p className="p-2 m-2 font-mono">
                From User: {strategy.userId}
            </p>
            <p className="p-2 m-2 font-mono">
                Created On: {strategy.createdAt.toLocaleDateString()}
            </p>
            <p className="p-2 m-2 font-mono">
                Last Updated: {strategy.updatedAt.toDateString()}
            </p>
        </div>
    )
}

export default StrategyOverview;