import FormInputHeader from "./FormInputHeader"
import LinePlot from "./LinePlot"
import MainStatistics from "./MainStatistics"
import DataTable from "./DataTable"
import DistributionOfReturns from "./DistributionOfReturns"
import RatiosBarChart from "./RatiosBarChart"
import { FiArrowUp } from "react-icons/fi"
import ResultButtonGroup from "./ResultButtonGroup"
import { FormInputProps } from "../Editor/Dashboard"
import calculateStats, { StatProps } from "../../scripts/calculateStats"
import { createResult, getSpecificStrategy } from "wasp/client/operations"

interface ResultPanelProps {
    selectedStrategy: string;
    formInputs: FormInputProps;
    stockData: any;
    abilityToSaveNew: boolean;
}

export default function ResultPanel({ selectedStrategy, formInputs, stockData, abilityToSaveNew }: ResultPanelProps) {

    const downloadCSV = () => {
        if (!stockData) return;

        // Get the headers (labels)
        const headers = Object.keys(stockData);

        // Create rows by combining data from each key (label)
        const rowCount = stockData[headers[0]].length; // Get the number of rows based on the first label's length
        const rows = Array.from({ length: rowCount }, (_, rowIndex) =>
            headers.map((header) => stockData[header][rowIndex]).join(',')
        );

        // Add the headers to the beginning of the CSV text
        const csv = [headers.join(','), ...rows].join('\n');

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'strategy_result.csv';
        link.click();
    };

    async function saveResult(name: string) {
        const connectedStrat = await getSpecificStrategy({ id: selectedStrategy });
        if (!connectedStrat?.code) {
            throw new Error('No strategy with that result.');
        }

        createResult({
            name: name,
            code: connectedStrat.code,
            formInputs: formInputs,
            data: stockData,
            strategyId: selectedStrategy
        })
    }

    const stats: StatProps = calculateStats({ stockData });

    return (
        <div id='pdfToSave'>
            <div id='mainResultDisplay' className='items-center flex p-2 justify-between border-b-2 border-black'>
                <h4 className="tracking-tight text-xl text-slate-700 font-extrabold text-center">
                    Stock Data and Simulated Backtest Result for
                    <span className="mx-2 text-black text-2xl">
                        {formInputs.symbol}
                    </span>
                </h4>
                <ResultButtonGroup saveResult={saveResult} abilityToSaveNew={abilityToSaveNew} symbol={formInputs.symbol} />
            </div>

            <div className="grid grid-cols-4 m-16 border-black rounded-sm border-2">
                <LinePlot stockData={stockData} />
                <FormInputHeader formInputs={formInputs} />
            </div>

            <div className="grid grid-cols-4 border-black border-y-2 max-h-132.5 overflow-y-auto">
                <MainStatistics stats={stats} />
                <DataTable stockData={stockData} />
                <button
                    className="border-t-2 col-span-4 border-black p-2 text-sm bg-white font-light hover:font-bold hover:bg-slate-200"
                    onClick={downloadCSV} // Trigger the download on click
                >
                    Download Data as .csv
                </button>
            </div>

            <div className="grid grid-cols-4 p-2 border-black border-b-2 bg-slate-100">
                <DistributionOfReturns stockDataReturns={stockData.returns} />
                <RatiosBarChart sharpe={stats.sharpeRatio} sortino={stats.sortinoRatio} />
            </div>

            <div className="flex justify-between m-2 pb-8">
                <button className="flex p-2 rounded-md hover:bg-slate-100"
                    onClick={() => document.getElementById('mainResultDisplay')?.scrollIntoView({ behavior: 'smooth' })}>
                    back to top <FiArrowUp />
                </button >
                <ResultButtonGroup saveResult={saveResult} abilityToSaveNew={abilityToSaveNew} symbol={formInputs.symbol} />
            </div>
        </div>
    )
}