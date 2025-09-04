import { useState } from "react";
import { MdSort } from "react-icons/md";
import { StrategyResultProps } from "../../../../shared/sharedTypes";

interface DataTableProps {
    strategyResult: StrategyResultProps;
}
function DataTable({ strategyResult }: DataTableProps) {

    // State for sorted data and sorting configuration
    const [sortedData, setSortedData] = useState<any>(strategyResult);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    // Sorting function
    const handleSort = (key: string) => {
        const direction = sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });

        // Create a sortable array of objects
        const combinedData: any[] = sortedData.timestamp.map((date: string, index: number) => ({
            date,
            signal: sortedData.signal[index],
            portfolio: sortedData.portfolio[index],
            returns: sortedData.returns[index],
        }));

        // Sort the combined data based on the selected key
        combinedData.sort((a, b) => {
            if (key === "date") {
                const s = new Date(a).getTime();
                const e = new Date(b).getTime();
                return direction === "asc" ? s - s : e - s;
            } else if (key === "signal") {
                return direction === "asc"
                    ? a.signal - b.signal
                    : b.signal - a.signal;
            } else if (key === "portfolio") {
                return direction === "asc"
                    ? a.portfolio - b.portfolio
                    : b.portfolio - a.portfolio;
            } else if (key === "returns") {
                return direction === "asc"
                    ? a.returns - b.returns
                    : b.returns - a.returns;
            }
            return 0;
        });

        // Unpack the sorted data back into separate arrays
        setSortedData({
            timestamp: combinedData.map((item) => item.date),
            signal: combinedData.map((item) => item.signal),
            portfolio: combinedData.map((item) => item.portfolio),
            returns: combinedData.map((item) => item.returns),
        });
    };

    // Get min and max returns for color scaling
    const minReturn = Math.min(...sortedData.returns);
    const maxReturn = Math.max(...sortedData.returns);

    // Function to interpolate color
    const getColor = (value: number) => {
        if (value >= 0) {
            // Normalize positive values to [0, 1]
            const maxPositive = Math.max(0, maxReturn); // Ensure maxPositive is non-negative
            const percentage = maxPositive === 0 ? 0 : value / maxPositive; // Avoid division by zero
            const green = Math.round(55 + 200 * percentage); // Scale green based on positive percentage
            return `rgba(0, ${green}, 0, ${.5 * green/255})`; // Shades of green
        } else {
            // Normalize negative values to [0, 1]
            const minNegative = Math.min(0, minReturn); // Ensure minNegative is non-positive
            const percentage = minNegative === 0 ? 0 : value / minNegative; // Avoid division by zero
            const red = Math.round(55 + 200 * percentage); // Scale red based on negative percentage
            return `rgba(${red}, 0, 0, ${.5 * red/255})`; // Shades of red
        }
    };

    return (
        <table className="w-full">
            <thead className="tracking-tight text-sm text-gray-700 bg-slate-200">
                <tr>
                    <TableHead column="date" label="Date" handleSort={handleSort} />
                    <TableHead column="signal" label="Buy/Short/Hold Signal" handleSort={handleSort} />
                    <TableHead column="portfolio" label="Portfolio Value" handleSort={handleSort} />
                    <TableHead column="returns" label="Period Return" handleSort={handleSort} />
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700 lowercase bg-white overflow-y-auto">
                {sortedData.timestamp.map((date: string, index: number) => (
                    <tr
                        className="text-center border-b-2 border-slate-100 hover:font-bold hover:bg-slate-100 hover:-translate-x-2 duration-200 group"
                        key={index}
                    >
                        <td className="font-extralight">
                            {new Date(date).toLocaleString()}
                        </td>

                        <td className="font-bold flex justify-center gap-x-4">
                            {sortedData.signal[index]}
                            <span
                                className="text-xs text-slate-400 hidden group-hover:flex  duration-500"
                            >(
                                {sortedData.signal[index] >= -1 && sortedData.signal[index] < -0.7
                                    ? "strong short"
                                    : sortedData.signal[index] >= -0.7 && sortedData.signal[index] < -0.3
                                        ? "short"
                                        : sortedData.signal[index] >= -0.3 && sortedData.signal[index] < 0
                                            ? "weak short"
                                            : sortedData.signal[index] === 0
                                                ? "hold"
                                                : sortedData.signal[index] > 0 && sortedData.signal[index] <= 0.3
                                                    ? "weak buy"
                                                    : sortedData.signal[index] > 0.3 && sortedData.signal[index] <= 0.7
                                                        ? "buy"
                                                        : "strong buy"}
                                )</span>
                        </td>
                        <td className="group">
                            $
                            <span className="group-hover:hidden">{sortedData.portfolio[index].toFixed(2)}</span>
                            <span className="hidden group-hover:inline">{sortedData.portfolio[index].toFixed(4)}</span>
                        </td>
                            <td
                                className="text-sm tracking-tight"
                                style={{
                                    background: getColor(sortedData.returns[index]), // Dynamic color
                                }}
                            >
                                {(100 * sortedData.returns[index]).toFixed(2)}%
                            </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

interface TableHeadProps {
    column: string;
    label: string;
    handleSort: (column: string) => void;
}

const TableHead = ({ column, label, handleSort }: TableHeadProps) => (
    <th
        className="hover:bg-slate-300 cursor-pointer gap-x-3 justify-center text-center items-center group"
        onClick={() => handleSort(column)}
    >
        <div>
            {label}
        </div>
        <MdSort className="absolute opacity-0 group-hover:opacity-100 duration-700" />
    </th>
);

export default DataTable;