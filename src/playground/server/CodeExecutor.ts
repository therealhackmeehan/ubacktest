import { PythonDataProps } from "../../shared/sharedTypes";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { HttpError } from "wasp/server";

class CodeExecutor {

    private userCode: string;
    private dataToEmbedInPython: PythonDataProps;
    private startDate: string;

    constructor(userCode: string, toInsertInPython: PythonDataProps, startDate: string) {
        this.userCode = userCode;
        this.dataToEmbedInPython = toInsertInPython;
        this.startDate = startDate;
    }

    public async execute() {
        if (!this.userCode) {
        }
        const uniqueKey = CodeExecutor.generateRandomKey();
        const embeddedCode = CodeExecutor.embedUserCode(this.userCode, uniqueKey, this.dataToEmbedInPython, this.startDate);

        //const zippedCode = await this.zip(embeddedCode);
        const { stdout, stderr } = await CodeExecutor.sendToJudge_simple(embeddedCode);

        return {
            stdout: stdout,
            stderr: stderr,
            uniqueKey: uniqueKey
        }
    }

    private async zip(codeToEmbed: string): Promise<string> {

        const builtins = CodeExecutor.builtins();
        const init = "";
        //const run = "#!/bin/bash\npip install pandas\n/usr/bin/python strategy.py";

        const run = `#!/bin/bash

# Update package list and install Python3, Pip
apt update && apt install -y python3 python3-pip

# Install pandas using pip
pip3 install --no-cache-dir pandas

# Run the Python script
python3 strategy.py
`

        try {
            const zipPath = path.join(process.cwd(), 'output.zip');
            const output = fs.createWriteStream(zipPath); // Use fs (not fs/promises)
            const archive = archiver('zip', { zlib: { level: 9 } });

            archive.pipe(output);

            // Create the dynamically generated file (e.g., strategy.py)
            const textFilePath = path.join(process.cwd(), 'strategy.py');
            await fsPromises.writeFile(textFilePath, codeToEmbed);
            archive.file(textFilePath, { name: 'strategy.py' });

            const packageName: string = 'myPackage';

            const packagePath = path.join(process.cwd(), packageName);
            await fsPromises.mkdir(packagePath, { recursive: true });

            const initFilePath = path.join(packagePath, '__init__.py');
            await fsPromises.writeFile(initFilePath, init);
            archive.file(initFilePath, { name: `${packageName}/__init__.py` });

            const builtinsFilePath = path.join(packagePath, 'builtins.py');
            await fsPromises.writeFile(builtinsFilePath, builtins);
            archive.file(builtinsFilePath, { name: `${packageName}/builtins.py` });

            const runFilePath = path.join(process.cwd(), 'run.sh');
            await fsPromises.writeFile(runFilePath, run);
            archive.file(runFilePath, { name: 'run.sh' });

            await archive.finalize();

            return (await fsPromises.readFile(zipPath)).toString('base64');
        } catch (Error: any) {
            throw new Error(500, "Error creating Base64 ZIP:" + Error.message);
        }

    }

    private static async sendToJudge_simple(mainFileContent: string) {

        const url = 'https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': process.env.JUDGE_APIKEY,
                'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language_id: 25,
                source_code: mainFileContent
            })
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new HttpError(503, `In Executing Code, Unable to make that request: ${response.statusText}`);
        }

        const fullResult = await response.json();
        console.log(fullResult);
        let { stdout, stderr } = fullResult;

        if (!stdout) stdout = '';
        if (!stderr) stderr = '';

        return { stdout, stderr };
    }

    private static async sendToJudge(zippedData: string) {

        const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': process.env.JUDGE_APIKEY,
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language_id: 89,
                source_code: "",
                additional_files: zippedData
            })
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new HttpError(503, `In Executing Code, Unable to make that request: ${response.statusText}`);
        }

        const submissionData = await response.json();
        const token = submissionData.token;
        console.log(`[${new Date().toISOString()}] Submission Token: ${token}`);

        const maxAttempts = 10;
        let attempt = 0;
        let statusId = 1;
        let stdout, stderr = '';

        while (attempt < maxAttempts) {
            await new Promise((res) => setTimeout(res, (attempt / 2) * 1000)); // Incremental delay (0.5s, 1s, 1.5s, ...)

            const url2 = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`;
            const options2 = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': process.env.JUDGE_APIKEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            };
            const response2 = await fetch(url2, options2)

            if (!response2.ok) {
                throw new Error(`Failed to get submission status: ${response2.statusText}`);
            }

            const resultData = await response2.json();
            statusId = resultData.status?.id;

            console.log(`[${new Date().toISOString()}] Polling Status ID: ${statusId}`);

            if (statusId !== 1 && statusId !== 2) {
                stdout = resultData.stdout || "";
                stderr = resultData.stderr || "";
                break;
            }

            attempt++;
        }

        if (statusId === 1 || statusId === 2) {
            throw new Error("Execution timeout: Judge0 did not return a final status.");
        }

        stdout = stdout ? CodeExecutor.decode(stdout) : "";
        stderr = stderr ? CodeExecutor.decode(stderr) : "";

        return { stdout, stderr };
    }

    private static decode(toDecode: string | null): string {
        if (!toDecode) return ''; // Handle empty/null cases
        return Buffer.from(toDecode, 'base64').toString('utf-8');
    }

    private static generateRandomKey(): string {
        return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    }

    private static embedUserCode(code: string, uniqueKey: string, toEmbedInMain: PythonDataProps, startDate: string): string {
        const dateToCompare = new Date(startDate).getTime() / 1000;

        const m =
            `${code}

import json
import pandas as pd

jsonCodeUnformatted = '${JSON.stringify(toEmbedInMain)}'
jsonCodeFormatted = json.loads(jsonCodeUnformatted)

df = pd.DataFrame(jsonCodeFormatted)
initHeight = df.shape[0]

df = strategy(df)

if not isinstance(df, pd.DataFrame):
    raise Exception("You must return a dataframe from your strategy.")

df.columns = df.columns.str.lower()

if 'signal' not in df.columns:
    raise Exception("There is no 'signal' column in the table.")

if (df.columns == 'signal').sum() > 1:
    raise Exception("There are two or more 'signal' columns in the table.")

if df['signal'].empty:
    raise Exception("'signal' column is empty.")

if not df.index.is_unique:
    raise Exception("Table index is not unique.")

if df.shape[0] != initHeight:
    raise Exception("The height of the dataframe has changed upon applying your strategy.")

df = df[df['timestamp'] >= ${dateToCompare}]

df['signal'] = df['signal'].fillna(method='ffill').fillna(0)
signalToReturn = df[['signal']].round(3).to_dict('list')

colsToExclude = {"open", "close", "high", "low", "volume", "timestamp", "signal"}

middleOutput = {
    "result": signalToReturn,
    "data": df.loc[:, ~df.columns.isin(colsToExclude)].fillna(0).round(3).to_dict('list')
}

output = "${uniqueKey}START${uniqueKey}" + json.dumps(middleOutput) + "${uniqueKey}END${uniqueKey}"
print(output)`;

        return m;
    }

    private static builtins(): string {
        const builtins =
            `import pandas as pd
import numpy as np

def rsi(column: pd.Series, n: int = 14) -> pd.Series:
    if len(column) < n:
        raise ValueError("Column length must be greater than or equal to n.")
    delta = column.diff()
    gain = np.where(delta > 0, delta, 0)
    loss = np.where(delta < 0, -delta, 0)
    avg_gain = pd.Series(gain).rolling(window=n, min_periods=n).mean()
    avg_loss = pd.Series(loss).rolling(window=n, min_periods=n).mean()
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))
    `;

        return builtins;
    }
}

export default CodeExecutor;