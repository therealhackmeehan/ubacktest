import { useState } from "react";
import { MdSort } from "react-icons/md";
import { StrategyResultProps } from "../../../../shared/sharedTypes";

type StrategyResultSortProps = Pick<
  StrategyResultProps,
  "timestamp" | "signal" | "portfolio" | "returns"
>;

type Row = {
  timestamp: string;
  signal: number;
  portfolio: number;
  returns: number;
};

type SortKey = keyof StrategyResultSortProps; // "timestamp" | "signal" | "portfolio" | "returns"

interface DataTableProps {
  strategyResult: StrategyResultProps;
}

function DataTable({ strategyResult }: DataTableProps) {
  // Extract only the fields we need
  const initialData: StrategyResultSortProps = {
    timestamp: strategyResult.timestamp,
    signal: strategyResult.signal,
    portfolio: strategyResult.portfolio,
    returns: strategyResult.returns,
  };

  const [sortedData, setSortedData] =
    useState<StrategyResultSortProps>(initialData);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: SortKey) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    setSortConfig({ key, direction });

    // Combine into sortable rows
    const combinedData: Row[] = sortedData.timestamp.map(
      (timestamp, index) => ({
        timestamp,
        signal: sortedData.signal[index],
        portfolio: sortedData.portfolio[index],
        returns: sortedData.returns[index],
      })
    );

    // Sorting logic
    combinedData.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      // Date sorting
      if (key === "timestamp") {
        const timeA = new Date(valA).getTime();
        const timeB = new Date(valB).getTime();
        return direction === "asc" ? timeA - timeB : timeB - timeA;
      }

      // Numeric sorting
      if (typeof valA === "number" && typeof valB === "number") {
        return direction === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });

    // Unpack back into arrays
    setSortedData({
      timestamp: combinedData.map((row) => row.timestamp),
      signal: combinedData.map((row) => row.signal),
      portfolio: combinedData.map((row) => row.portfolio),
      returns: combinedData.map((row) => row.returns),
    });
  };

  // Min/max for color scaling
  const minReturn = Math.min(...sortedData.returns);
  const maxReturn = Math.max(...sortedData.returns);

  const getColor = (value: number) => {
    if (value >= 0) {
      const maxPositive = Math.max(0, maxReturn);
      const percentage = maxPositive === 0 ? 0 : value / maxPositive;
      const green = Math.round(55 + 200 * percentage);
      return `rgba(0, ${green}, 0, ${(0.5 * green) / 255})`;
    } else {
      const minNegative = Math.min(0, minReturn);
      const percentage = minNegative === 0 ? 0 : value / minNegative;
      const red = Math.round(55 + 200 * percentage);
      return `rgba(${red}, 0, 0, ${(0.5 * red) / 255})`;
    }
  };

  return (
    <table className="w-full">
      <thead className="tracking-tight text-sm text-gray-700 bg-slate-200">
        <tr>
          <TableHead column="timestamp" label="Date" handleSort={handleSort} />
          <TableHead
            column="signal"
            label="Buy/Short/Hold Signal"
            handleSort={handleSort}
          />
          <TableHead
            column="portfolio"
            label="Portfolio Value"
            handleSort={handleSort}
          />
          <TableHead
            column="returns"
            label="Period Return"
            handleSort={handleSort}
          />
        </tr>
      </thead>
      <tbody className="text-sm text-gray-700 lowercase bg-white overflow-y-auto">
        {sortedData.timestamp.map((timestamp, index) => (
          <tr
            className="text-center border-b-2 border-slate-100 hover:font-bold hover:bg-slate-100 hover:-translate-x-2 duration-200 group"
            key={index}
          >
            <td className="font-extralight">
              {new Date(timestamp).toLocaleString()}
            </td>

            <td className="font-bold flex justify-center gap-x-4">
              {sortedData.signal[index]}
              <span className="text-xs text-slate-400 hidden group-hover:flex duration-500">
                (
                {sortedData.signal[index] >= -1 &&
                sortedData.signal[index] < -0.7
                  ? "strong short"
                  : sortedData.signal[index] >= -0.7 &&
                      sortedData.signal[index] < -0.3
                    ? "short"
                    : sortedData.signal[index] >= -0.3 &&
                        sortedData.signal[index] < 0
                      ? "weak short"
                      : sortedData.signal[index] === 0
                        ? "hold"
                        : sortedData.signal[index] > 0 &&
                            sortedData.signal[index] <= 0.3
                          ? "weak buy"
                          : sortedData.signal[index] > 0.3 &&
                              sortedData.signal[index] <= 0.7
                            ? "buy"
                            : "strong buy"}
                )
              </span>
            </td>

            <td className="group">
              $
              <span className="group-hover:hidden">
                {sortedData.portfolio[index].toFixed(2)}
              </span>
              <span className="hidden group-hover:inline">
                {sortedData.portfolio[index].toFixed(4)}
              </span>
            </td>

            <td
              className="text-sm tracking-tight"
              style={{
                background: getColor(sortedData.returns[index]),
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
  column: SortKey;
  label: string;
  handleSort: (column: SortKey) => void;
}

const TableHead = ({ column, label, handleSort }: TableHeadProps) => (
  <th
    className="hover:bg-slate-300 cursor-pointer gap-x-3 justify-center text-center items-center group"
    onClick={() => handleSort(column)}
  >
    <div>{label}</div>
    <MdSort className="absolute opacity-0 group-hover:opacity-100 duration-700" />
  </th>
);

export default DataTable;
