import ResultHeader from "./ResultHeader";
import LinePlot from "./LinePlot";
import MainStatistics from "./MainStatistics";
import DataTable from "./DataTable";

interface resultProps {
    stockData: any;
    symbol: string;
}

export default function Result({ stockData, symbol }: resultProps) {

    if (!stockData) {
        return (
            <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">No Results to Display</div>
        )
    }

    return (
        <>
            <ResultHeader symbol={symbol} />
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