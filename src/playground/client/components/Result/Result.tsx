import ResultHeader from "./ResultHeader";
import LinePlot from "./LinePlot";
import MainStatistics from "./MainStatistics";
import DataTable from "./DataTable";
import { FormInputProps } from "../Editor/Dashboard";

interface ResultProps {
    stockData: any;
    formInputs: FormInputProps;
    strategyResultIsConnectedTo: string;
    selectedStrategy: string;
}

export default function Result({ stockData, formInputs, strategyResultIsConnectedTo, selectedStrategy }: ResultProps) {

    if ((!stockData) || (strategyResultIsConnectedTo !== selectedStrategy)) {
        return (
            <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">
                No Results to Display for This Strategy
            </div>
        )
    }

    return (
        <>
            <ResultHeader symbol={formInputs.symbol} />
            <div className="grid grid-cols-4 p-5">
                <div className="col-span-3">
                    <LinePlot stockData={stockData} />
                </div>
                <MainStatistics />
            </div>
            <div className="grid grid-cols-5 p-5">
                <div className="col-span-3 p-5">
                    <DataTable stockData={stockData} />
                </div>
                <div className="col-span-1 p-5">
                    <DataTable stockData={stockData} />
                </div>
                <div className="col-span-1 p-5">
                    <DataTable stockData={stockData} />
                </div>
            </div>
            <div className="grid grid-cols-4 p-5">
                <MainStatistics />
                <div className="col-span-3">
                    <LinePlot stockData={stockData} />
                </div>
            </div>
            <div className="grid grid-cols-5 p-5">
                <div className="col-span-1 p-5">
                    <DataTable stockData={stockData} />
                </div>
                <div className="col-span-3 p-5">
                    <DataTable stockData={stockData} />
                </div>
                <div className="col-span-1 p-5">
                    <DataTable stockData={stockData} />
                </div>
            </div>
        </>
    );
};