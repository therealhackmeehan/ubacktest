import FormInputHeader from "./FormInputHeader"
import MainStatistics from "./MainStatistics"
import DataTable from "./DataTable"
import DistributionOfReturns from "./DistributionOfReturns"
import { FiArrowUp } from "react-icons/fi"
import ResultButtonGroup from "./ResultButtonGroup"
import { FormInputProps, StatProps, StrategyResultProps } from "../../../../shared/sharedTypes"
import { createResult, getSpecificStrategy } from "wasp/client/operations"
import SPChart from "./SPChart"
import UserDefinedPlot from "./UserDefinedPlot"
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import LoadingScreen from "../../../../client/components/LoadingScreen"
import CandlePlot from "./CandlePlot"
import ErrorModal from "../modals/ErrorModal"
import CashEquity from "./CashEquity"

interface ResultPanelProps {
    selectedStrategy: string | null;
    formInputs: FormInputProps;
    strategyResult: StrategyResultProps;
    stats: StatProps;
    abilityToSaveNew: boolean;
}

function Result({ selectedStrategy, formInputs, strategyResult, stats, abilityToSaveNew }: ResultPanelProps) {

    const [userDefinedPlotOpen, setUserDefinedPlotOpen] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>('');

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
            strategyId: selectedStrategy,
            stats: stats
        })
    }

    const downloadCSV = () => {
        if (!strategyResult) return;

        // Get the headers (labels)
        let headers = Object.keys(strategyResult);
        headers = headers.filter(header =>
            // we unfortunately can't let users download a large chunk of the data for legal reasons
            !['userDefinedData', 'equityWithCosts', 'cashWithCosts', 'open', 'close', 'high', 'low', 'volume'].includes(header) &&
            !(formInputs.costPerTrade === 0 && header === 'portfolioWithCosts')
        );

        // If timestamp exists and isn't already filtered out, rename the timestamp column
        const includeTimestamp = headers.includes('timestamp');
        const displayHeaders = headers.map(header =>
            header === 'timestamp' ? 'timestamp (local time)' : header
        );

        const rowCount = strategyResult[headers[0]].length;

        const rows = Array.from({ length: rowCount }, (_, rowIndex) =>
            headers.map((header) => {
                const value = strategyResult[header][rowIndex];
                if (header === 'timestamp') {
                    return new Date(value * 1000).toLocaleString().replace(',', "");
                }
                return value;
            }).join(',')
        );

        const csv = [displayHeaders.join(','), ...rows].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = formInputs.symbol + '_strategy_result.csv';
        link.click();
    };

    const pdfRef = useRef<HTMLDivElement>(null);
    const saveAsPDF = async () => {
        if (!pdfRef.current) return;

        setLoading(true);
        try {
            // Capture the content as a canvas
            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
            });

            // Get canvas dimensions
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // PDF dimensions
            const pdfWidth = 595.28; // A4 width in points (72 DPI)
            const pdfHeight = 841.89; // A4 height in points (72 DPI)

            // Margins (e.g., 20 points on all sides)
            const margin = 20;
            const availableWidth = pdfWidth - 2 * margin;
            const availableHeight = pdfHeight - 2 * margin;

            // Calculate scaling to fit content while maintaining aspect ratio
            const scale = Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight);
            const imgWidth = canvasWidth * scale;
            const imgHeight = canvasHeight * scale;

            // Convert canvas to image
            const imgData = canvas.toDataURL("image/png");

            // Initialize jsPDF
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4",
            });

            // Center the image within the available area (accounting for margins)
            const xOffset = margin + (availableWidth - imgWidth) / 2;
            const yOffset = margin / 2;

            doc.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

            // Save the PDF
            doc.save(`${formInputs.symbol || "document"}_saved_result.pdf`);
        } catch (error: any) {
            setErrorMsg(error.msg)
        } finally {
            setLoading(false);
        }
    };

    const minDate = formInputs.useWarmupDate ? formInputs.warmupDate : null;

    return (
        <>
            {loading && <LoadingScreen />}

            {errorMsg && <ErrorModal msg={errorMsg} closeModal={() => setErrorMsg('')} />}

            <div className="relative px-0 md:px-12 lg:px-24 bg-white min-w-187.5">

                {/* header and top button row */}
                <div id='topOfResultPanel' className='items-center flex p-2 justify-between border-b-2 border-black'>
                    <h4 className="tracking-tight text-xl text-slate-700 font-extrabold text-center">
                        Stock Data and Simulated Backtest Result for
                        <span className="mx-2 text-slate-500 italic uppercase text-2xl">
                            {formInputs.symbol}
                        </span>
                    </h4>
                    <ResultButtonGroup saveResult={saveResult} saveAsPDF={saveAsPDF} abilityToSaveNew={abilityToSaveNew} symbol={formInputs.symbol} />
                </div>

                {/* Strategy result plot and some form inputs */}
                <div className="m-8">
                    <div className="flex justify-between">
                        <div className="m-1 text-xl tracking-tight text-slate-400 hover:text-slate-800 font-bold">Hypothetical Growth of $1</div>
                        <div className="font-extrabold text-xs text-sky-700/50">scroll to zoom. click to reset.</div>
                    </div>
                    <CandlePlot strategyResult={strategyResult} costPerTrade={formInputs.costPerTrade} minDate={minDate} symbol={formInputs.symbol} />
                    {(strategyResult.userDefinedData && Object.keys(strategyResult.userDefinedData).length > 0) && (
                        <div className="mt-1 mb-4 bg-slate-50 rounded-lg">
                            {userDefinedPlotOpen && (
                                <div className="mt-2">
                                    <UserDefinedPlot
                                        strategyResult={strategyResult}
                                        timestamp={strategyResult.timestamp}
                                    />
                                </div>
                            )}
                            <button
                                className="w-full tracking-tight font-bold text-sky-800 hover:text-red-300 text-center animate-pulse my-1 py-1"
                                onClick={() => setUserDefinedPlotOpen(!userDefinedPlotOpen)}
                            >
                                {userDefinedPlotOpen
                                    ? 'Show less'
                                    : 'We found other columns in your DataFrame. Click to view.'}
                            </button>
                        </div>
                    )}
                    <FormInputHeader formInputs={formInputs} />
                </div>

                {/* Stats and Data Table of All Trades */}
                <div className="grid grid-cols-3 gap-x-6 justify-stretch m-8">
                    {stats && <MainStatistics stats={stats} />}
                    <div className="col-span-2 bg-slate-100 rounded-lg max-h-132.5 overflow-y-auto shadow-sm border-2 border-slate-300">
                        <div className="flex justify-between m-2">
                            <div className="text-sky-700 font-extrabold tracking-tight text-lg">Trade Log</div>
                            <button
                                className="text-xs border-2 border-slate-600 p-1 rounded-lg bg-white font-light hover:shadow-lg hover:bg-slate-200"
                                onClick={downloadCSV} // Trigger the download on click
                            >
                                Download Data as .csv
                            </button>
                        </div>
                        <DataTable strategyResult={strategyResult} />
                    </div>
                </div>

                <div className="m-8">
                    <div className="rounded-sm bg-white">
                        <CashEquity strategyResult={strategyResult} />
                    </div>
                </div>

                {/* Histogram of Charts */}
                {stats && strategyResult.returns.some(r => r !== 0) && (
                    <div className="p-2 m-8 rounded-lg bg-slate-100">

                        <DistributionOfReturns
                            stockDataReturns={strategyResult.returns}
                            mean={stats.meanReturn}
                            stddev={stats.stddevReturn}
                            max={stats.maxReturn}
                            min={stats.minReturn}
                        />
                    </div>
                )}

                {strategyResult.sp.length > 0 &&
                    <div className="m-8">
                        <div className="rounded-sm bg-white">
                            <SPChart strategyResult={strategyResult} />
                        </div>
                    </div>
                }

                {/* Footer of buttons */}
                <div className="flex justify-between m-2 pb-8">
                    <button className="flex p-2 rounded-md hover:bg-slate-100"
                        onClick={() => document.getElementById('topOfResultPanel')?.scrollIntoView({ behavior: 'smooth' })}>
                        back to top <FiArrowUp />
                    </button >
                    <ResultButtonGroup saveResult={saveResult} saveAsPDF={saveAsPDF} abilityToSaveNew={abilityToSaveNew} symbol={formInputs.symbol} />
                </div>
            </div>

            {/* invisible rendition for accurate PDF rendering! */}
            <div ref={pdfRef} style={{ position: 'absolute', zIndex: -1, left: '-10000px', top: 'auto', width: '100%' }}>
                <div className="tracking-tight text-2xl font-bold text-black text-end p-6">
                    Strategy Report, Traded on {formInputs.symbol.toUpperCase()}
                </div>
                <div className="m-1 text-xl tracking-tight text-slate-400 hover:text-slate-800 font-bold">Hypothetical Growth of $1</div>
                <div className="rounded-t-md border-2 border-slate-300 w-full">
                    <CandlePlot strategyResult={strategyResult} costPerTrade={formInputs.costPerTrade} minDate={minDate} symbol={formInputs.symbol} />
                </div>
                <FormInputHeader formInputs={formInputs} />

                <div className="m-8">
                    {stats && <MainStatistics stats={stats} />}
                </div>

                <div className="p-2 m-8 border-black border-2 rounded-lg bg-slate-100">
                    {stats && strategyResult.returns.some(r => r !== 0) && (
                        <DistributionOfReturns
                            stockDataReturns={strategyResult.returns}
                            mean={stats.meanReturn}
                            stddev={stats.stddevReturn}
                            max={stats.maxReturn}
                            min={stats.minReturn}
                        />
                    )}
                </div>

                {strategyResult.sp.length > 0 &&
                    <div className="m-8">
                        <div className="rounded-sm bg-white">
                            <SPChart strategyResult={strategyResult} />
                        </div>
                    </div>
                }
            </div>
            {/* End Invisible PDF Rendition */}
        </>
    )
}

export default Result;