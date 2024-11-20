import { HttpError } from "wasp/server";

interface DataProps {
    data: any;
    code: string;
}

function generateRandomKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function runPythonCode({ data, code }: DataProps) {
    // Generate a unique key to mark the output
    const uniqueKey = generateRandomKey();

    const mainFile = `# main.py
from strategy import strategy
import json
import pandas as pd
jsonCodeUnformatted = '${JSON.stringify(data)}'
jsonCodeFormatted = json.loads(jsonCodeUnformatted)
df = pd.DataFrame(jsonCodeFormatted)
df = strategy(df)
df.columns = df.columns.str.lower()
print("${uniqueKey}START${uniqueKey}" + str(df['signal'].to_json(orient='values')) + "${uniqueKey}END${uniqueKey}")
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
                    content: code
                },
            ],
        })
    });

    const result = await response.json();
    console.log(result)

    const stderr = result.run.stderr;
    const stdout = result.run.stdout;
    if (result.run.signal == "SIGKILL" && !stderr && !stdout) {
        throw new HttpError(
            500,
            "SIGKILL: Your program was terminated because it exceeded resource limits."
        );
    }

    // extract the important result
    // forward all other stdout to the console
    const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
    const match = stdout.match(regex);
    const signal = match ? JSON.parse(match[1]) : null;
    const debugOutput = signal ? stdout.replace(regex, '').trim() : stdout;
    ;

    return { signal, debugOutput, stderr };
}

export default runPythonCode;