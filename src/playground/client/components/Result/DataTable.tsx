import { useState } from "react";
import { MdSort } from "react-icons/md";

export default function DataTable({ stockData }: any) {
    // State for sorted data and sorting configuration
    const [sortedData, setSortedData] = useState(stockData);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    // Sorting function
    const handleSort = (key: string) => {
        const direction = sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });

        // Create a sortable array of objects
        const combinedData: any[] = sortedData.timestamp.map((date: any, index: number) => ({
            date,
            signal: sortedData.signal[index],
            portfolio: sortedData.portfolio[index],
            returns: sortedData.returns[index],
        }));

        // Sort the combined data based on the selected key
        combinedData.sort((a, b) => {
            if (key === "date") {
                return direction === "asc" ? a.date - b.date : b.date - a.date;
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
        const percentage = (value - minReturn) / (maxReturn - minReturn); // Normalize to [0, 1]
        const red = Math.round(255 * (1 - percentage)); // More red for lower values
        const green = Math.round(255 * percentage); // More green for higher values
        return `rgba(${red}, ${green}, 0, 0.15)`; // Red to Green gradient
    };

    return (
        <table className="m-4 col-span-3">
            <thead className="sticky tracking-tight text-gray-700 bg-slate-200">
                <tr>
                    <TableHead column="date" label="Date" handleSort={handleSort} />
                    <TableHead column="signal" label="Buy/Short/Hold Signal" handleSort={handleSort} />
                    <TableHead column="portfolio" label="Portfolio Value" handleSort={handleSort} />
                    <TableHead column="returns" label="Period Return" handleSort={handleSort} />
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700 lowercase bg-white">
                {sortedData.timestamp.map((date: any, index: number) => (
                    <tr
                        className="text-center group border-b-2 border-slate-100 hover:font-bold hover:bg-slate-100 hover:-translate-x-2 duration-200"
                        key={index}
                    >
                        <td className="font-bold">
                            {new Date(date * 1000).toLocaleDateString()}
                        </td>

                        <td className="font-bold">
                            {sortedData.signal[index]}
                            <span
                                className="text-xs text-slate-400 mx-4 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
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
                        {index == 0 ? <td className="text-lg tracking-tight">na.</td> :
                            <td
                                className="text-lg tracking-tight"
                                style={{
                                    background: getColor(sortedData.returns[index]), // Dynamic color
                                }}
                            >
                                {(100 * sortedData.returns[index]).toFixed(2)}%
                            </td>}
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