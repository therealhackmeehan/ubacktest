import ResultHeader from "./ResultHeader";
import LinePlot from "./LinePlot";
import MainStatistics from "./MainStatistics";
import DataTable from "./DataTable";

interface resultProps {
    stockData: any;
    symbol: string;
    setResultOpen: (value: boolean) => void;
}

export default function Result({ stockData, symbol, setResultOpen }: resultProps) {

    return (
        <>
            <ResultHeader symbol={symbol} setResultOpen={setResultOpen} />
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