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


    const mainFile = 
`# main.py

from strategy import strategy
import json
import pandas as pd

jsonCodeUnformatted = '${JSON.stringify(data)}'
jsonCodeFormatted = json.loads(jsonCodeUnformatted)

df = pd.DataFrame(jsonCodeFormatted)
initHeight = df.shape[0]

df = strategy(df)
if not isinstance(df, pd.DataFrame):
    raise Exception("You must return a dataframe from your strategy.")

df.columns = df.columns.str.lower()


if 'signal' not in df.columns:
    raise Exception("There is no 'signal' column in the table.")

if any(df.columns.duplicated()):
    raise Exception("There are two or more 'signal' columns in the table.")

if df['signal'].empty:
    raise Exception("'signal' column is empty.")

if df['signal'].isnull().any():
    raise Exception("'signal' column contains null values.")

if not df.index.is_unique:
    raise Exception("Table index is not unique.")

if df.shape[0] != initHeight:
    raise Exception("The height of the dataframe has changed upon applying your strategy.")


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

    const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
    const match = stdout.match(regex);
    const signal = match ? JSON.parse(match[1]) : null;
    const debugOutput = signal ? stdout.replace(regex, '').trim() : stdout;

    return { signal, debugOutput, stderr };
}

export default runPythonCode;