// interface StockData {
//     indicators: {
//         quote: Array<Record<string, any>>;
//     };
// }

// interface PistonResponse {
//     ran: boolean;
//     language: string;
//     version: string;
//     output: string;
//     stdout: string;
//     stderr: string;
// }

export default async function executePythonCode(stockData, code: string): Promise<any> {
    const mainFile = `#
from strategy import myStrategy
import json
import pandas as pd
jsonCodeUnformatted = '${JSON.stringify(stockData)}'
jsonCodeFormatted = json.loads(jsonCodeUnformatted)

df = pd.DataFrame(jsonCodeFormatted)
signalResult = myStrategy(df)
signalResult = signalResult['signal'];
print(str(signalResult.to_json(orient='values')))
`;

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language: "python",
            version: "3.10.0",
            files: [
                {
                    name: "main.py",
                    content: mainFile
                },
                {
                    name: "strategy.py",
                    content: code // assuming `code` is defined elsewhere or passed in
                },
            ],
        })
    });

    const output: Promise<any> = await response.json();
    return output;
};
