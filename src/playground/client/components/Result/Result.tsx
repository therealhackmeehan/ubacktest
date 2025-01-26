import FormInputHeader from "./FormInputHeader"
import LinePlot from "./LinePlot"
import MainStatistics from "./MainStatistics"
import DataTable from "./DataTable"
import DistributionOfReturns from "./DistributionOfReturns"
// import RatiosBarChart from "./RatiosBarChart"
import { FiArrowUp } from "react-icons/fi"
import ResultButtonGroup from "./ResultButtonGroup"
import { FormInputProps, StrategyResultProps } from "../../../../shared/sharedTypes"
import calculateStats, { StatProps } from "../../scripts/calculateStats"
import { createResult, getSpecificStrategy } from "wasp/client/operations"
import SPChart from "./SPChart"
import ContentWrapper from "../../../../client/components/ContentWrapper"
import UserDefinedPlot from "./UserDefinedPlot"
import { useState } from "react"

interface ResultPanelProps {
    selectedStrategy: string | null;
    formInputs: FormInputProps;
    strategyResult: StrategyResultProps;
    abilityToSaveNew: boolean;
}

function Result({ selectedStrategy, formInputs, strategyResult, abilityToSaveNew }: ResultPanelProps) {

    const [userDefinedPlotOpen, setUserDefinedPlotOpen] = useState<boolean>(false);

    const downloadCSV = () => {
        if (!strategyResult) return;

        // Get the headers (labels)
        const headers = Object.keys(strategyResult);

        // Create rows by combining data from each key (label)
        const rowCount = strategyResult[headers[0]].length; // Get the number of rows based on the first label's length
        const rows = Array.from({ length: rowCount }, (_, rowIndex) =>
            headers.map((header) => strategyResult[header][rowIndex]).join(',')
        );

        // Add the headers to the beginning of the CSV text
        const csv = [headers.join(','), ...rows].join('\n');

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = formInputs.symbol + '_strategy_result.csv';
        link.click();
    };

    async function saveResult(name: string) {
        if (!selectedStrategy) return;

        const connectedStrat = await getSpecificStrategy({ id: selectedStrategy });
        if (!connectedStrat?.code) {
            throw new Error('No strategy with that result.');
        }

        await createResult({
            name: name,
            code: connectedStrat.code,
            formInputs: formInputs,
            data: strategyResult,
            strategyId: selectedStrategy
        })
    }

    const stats: StatProps = calculateStats(strategyResult);

    return (
        <ContentWrapper>

            <div id='topOfResultPanel' className='items-center flex p-2 justify-between border-b-2 border-black'>
                <h4 className="tracking-tight text-xl text-slate-700 font-extrabold text-center">
                    Stock Data and Simulated Backtest Result for
                    <span className="mx-2 text-slate-500 underline uppercase text-2xl">
                        {formInputs.symbol}
                    </span>
                </h4>
                <ResultButtonGroup saveResult={saveResult} abilityToSaveNew={abilityToSaveNew} symbol={formInputs.symbol} />
            </div>

            <>
                <div className="m-8">
                    <div className="m-1 text-xl tracking-tight text-slate-400 hover:text-slate-800 font-bold">Hypothetical Growth of $1</div>
                    <div className="rounded-t-md border-2 border-slate-300 h-200">
                        <LinePlot strategyResult={strategyResult} costPerTrade={formInputs.costPerTrade} />
                    </div>
                    {(strategyResult.userDefinedData && Object.keys(strategyResult.userDefinedData).length > 0) && (
                        <div className="border-x-2 border-b-2 bg-white border-slate-300">
                            <button
                                className="w-full text-xs tracking-tight font-bold text-sky-800 hover:text-red-300 text-center animate-pulse"
                                onClick={() => setUserDefinedPlotOpen(!userDefinedPlotOpen)}
                            >
                                {userDefinedPlotOpen
                                    ? 'Show less'
                                    : 'We found other columns in your dataframe. Click to view.'}
                            </button>
                            {userDefinedPlotOpen && (
                                <div className="mt-2">
                                    <UserDefinedPlot
                                        userDefinedData={strategyResult.userDefinedData}
                                        timestamp={strategyResult.timestamp}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <FormInputHeader formInputs={formInputs} />
                </div>

                <div className="grid grid-cols-3 gap-x-6 justify-stretch m-8">
                    <MainStatistics stats={stats} />
                    <div className="col-span-2 bg-slate bg-slate-100 rounded-sm border-2 border-slate-400 max-h-132.5 overflow-y-auto">
                        <div className="flex justify-between mx-2">
                            <div className="text-xl font-mono text-black/60 p-3 text-end">Trade Log</div>
                            <button
                                className="text-sm m-3 p-2 border-2 border-black rounded-lg bg-white font-light hover:shadow-lg hover:bg-slate-200"
                                onClick={downloadCSV} // Trigger the download on click
                            >
                                Download Data as .csv
                            </button>
                        </div>
                        <DataTable strategyResult={strategyResult} />
                    </div>
                </div>
            </>

            <div className="grid grid-cols-4 p-2 gap-x-2 m-8 border-black border-2 rounded-lg bg-slate-100">
                <DistributionOfReturns stockDataReturns={strategyResult.returns} mean={stats.meanReturn} stddev={stats.stddevReturn} max={stats.maxReturn} min={stats.minReturn} />
                {/* <RatiosBarChart sharpe={stats.sharpeRatio} sortino={stats.sortinoRatio} /> */}
            </div>

            {strategyResult.sp.length > 0 &&
                <div className="m-8">
                    <div className="text-xl tracking-tight text-slate-400 hover:text-slate-800 font-bold">Did You Beat the S&P 500?</div>
                    <div className="rounded-sm border-2 border-slate-300 bg-slate-50">
                        <SPChart strategyResult={strategyResult} />
                    </div>
                </div>
            }

            <div className="flex justify-between m-2 pb-8">
                <button className="flex p-2 rounded-md hover:bg-slate-100"
                    onClick={() => document.getElementById('topOfResultPanel')?.scrollIntoView({ behavior: 'smooth' })}>
                    back to top <FiArrowUp />
                </button >
                <ResultButtonGroup saveResult={saveResult} abilityToSaveNew={abilityToSaveNew} symbol={formInputs.symbol} />
            </div>
        </ContentWrapper>
    )
}

export default Result;