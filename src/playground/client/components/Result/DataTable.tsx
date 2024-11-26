export default function DataTable({ stockData }: any) {
    return (
        <table className="p-4 m-4 w-full table-auto border-l-2 border-t-2 border-black">
            <thead className="border-b border-black text-sm text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th>Date</th>
                    <th>Signal</th>
                    <th>Portfolio Value</th>
                    <th>Close Price</th>
                </tr>
            </thead>
            <tbody className="text-xs text-gray-700 lowercase bg-white">
                {stockData.timestamp.map((date: any, index: number) => (
                    <tr className="border-b-2 text-end border-gray-100" key={index}>
                        <td>{new Date(date * 1000).toLocaleDateString()}</td>
                        <td>{stockData.signal[index]}</td>
                        <td>${stockData.portfolio[index].toFixed(2)}</td>
                        <td>${stockData.close[index].toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
