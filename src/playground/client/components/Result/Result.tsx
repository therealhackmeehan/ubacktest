import ResultHeader from "./ResultHeader";
import LinePlot from "./LinePlot";
import MainStatistics from "./MainStatistics";
import DataTable from "./DataTable";
import { FormInputProps } from "../Editor/Dashboard";
import FormInputHeader from "./FormInputHeader";
import DistributionOfReturns from "./DistributionOfReturns";
import RatiosBarChart from "./RatiosBarChart";
import ResultButtonGroup from "./ResultButtonGroup";
import { FiArrowUp } from "react-icons/fi";

interface ResultProps {
    stockData: any;
    formInputs: FormInputProps;
    strategyResultIsConnectedTo: string;
    selectedStrategy: string;
}

export default function Result({ stockData, formInputs, strategyResultIsConnectedTo, selectedStrategy }: ResultProps) {

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
        link.download = 'data.csv';
        link.click();
    };

    if ((!stockData) || (strategyResultIsConnectedTo !== selectedStrategy)) {
        return (
            <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">
                No Results to Display for This Strategy
            </div>
        );
    }

    return (
        <>
            <ResultHeader symbol={formInputs.symbol} />
            <FormInputHeader formInputs={formInputs} />

            <LinePlot stockData={stockData} />

            <div className="grid grid-cols-4 border-black border-y-2 max-h-132.5 overflow-y-auto">
                <MainStatistics stockData={stockData} />
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
                <RatiosBarChart sharpe={12.2} sortino={14.3} />
            </div>

            <div className="flex justify-between m-2 pb-8">
                <button className="flex p-2 rounded-md hover:bg-slate-100"
                    onClick={() => document.getElementById('topOfResult').scrollIntoView({ behavior: 'smooth' })}>
                    back to top <FiArrowUp />
                </button >
                <ResultButtonGroup />
            </div>
        </>
    );
};
