import { PythonDataProps } from "../../shared/sharedTypes";
import { HttpError } from "wasp/server";

/*
    Backend endpoint for executing python code in an isolated,
    secure environment, using Judge0 API.

    Inserts user script into the body of a python script and executes
    that script, after given access to the stock data.

    simply returns the stdout and stderr of the execution.

    (c) 2025 Jack Meehan. uBacktest.
*/

class CodeExecutor {

    // store user code and additional form inputs specific to code execution
    private userCode: string;
    private dataToEmbedInPython: PythonDataProps;
    private startDate: string;

    constructor(userCode: string, toInsertInPython: PythonDataProps, startDate: string) {
        this.userCode = userCode;
        this.dataToEmbedInPython = toInsertInPython;
        this.startDate = startDate;
    }

    public async execute() {

        // wrap desired stdout in a unique key, so we can access our own data at a later point, and keep user stdout seperate
        const uniqueKey = CodeExecutor.generateRandomKey();
        const embeddedCode = CodeExecutor.embedUserCode(this.userCode, uniqueKey, this.dataToEmbedInPython, this.startDate);

        // send to the Judge0 API and grab both the stdout and stderr
        const { stdout, stderr } = await CodeExecutor.sendToJudge_simple(embeddedCode);

        if (!stdout && !stderr) {
            throw new HttpError(400, "Unable to illicit a response from the python engine. This may indicate your request timed out, so try again.");
        }

        return {
            stdout: stdout,
            stderr: stderr,
            uniqueKey: uniqueKey
        }
    }

    private static async sendToJudge_simple(mainFileContent: string) {

        const url = 'https://judge0-extra-ce.p.sulu.sh/submissions?base64_encoded=false&wait=true';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.JUDGE_APIKEY_SULU}`
            },
            body: JSON.stringify({
                language_id: 32, // python for ML (base image)
                source_code: mainFileContent
            })
        };

        const response = await fetch(url, options);

        const fullResult = await response.json();
        console.log(fullResult);

        if (!response.ok) { // error right away if the response is not ok
            const errorMsg = fullResult?.error; // if error available, append to errMsg
            throw new HttpError(503, `In Executing Code, Unable to make that request: ${errorMsg || response.statusText}`);
        }

        let { stdout, stderr } = fullResult;

        if (!stdout) stdout = '';
        if (!stderr) stderr = '';

        return { stdout, stderr };
    }

    private static generateRandomKey(): string {
        return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    }

    private static embedUserCode(code: string, uniqueKey: string, toEmbedInMain: PythonDataProps, startDate: string): string {
        const dateToCompare = new Date(startDate).getTime() / 1000;

        // python string (where the magic happens)
        const m =
            `${code}

import json
import pandas as pd
import sys
import warnings
import os

original_stdout = sys.stdout

# Redirect warnings to stdout
warnings.simplefilter("always")
warnings.showwarning = lambda message, category, filename, lineno, file=None, line=None: \
    print(f"{category.__name__}: {message}", file=sys.stdout)

jsonCodeUnformatted = '${JSON.stringify(toEmbedInMain)}'
jsonCodeFormatted = json.loads(jsonCodeUnformatted)

df_init = pd.DataFrame(jsonCodeFormatted)
initHeight = df_init.shape[0]

if initHeight <= 3:
    raise Exception("Sorry, we detected less than 3 data points and had trouble applying your strategy.")

df = strategy(df_init)

sys.stdout = open(os.devnull, 'w')

if not isinstance(df, pd.DataFrame):
    raise Exception("You must return a dataframe from your strategy.")

df.columns = df.columns.str.lower()

if 'signal' not in df.columns:
    raise Exception("There is no 'signal' column in the table.")

if (df.columns == 'signal').sum() > 1:
    raise Exception("There are two or more 'signal' columns in the table.")

if df['signal'].empty:
    raise Exception("'signal' column is empty.")

if (df['signal'] > 1).any() or (df['signal'] < -1).any():
    raise Exception("'signal' column contains values outside the range [-1, 1].")

if not df.index.is_unique:
    raise Exception("Table index is not unique.")

if df.shape[0] != initHeight:
    raise Exception("The height of the dataframe has changed upon applying your strategy.")

df['signal'] = df['signal'].ffill().fillna(0)

warning = ""
warningMsg = "Potential feedforward bias detected. A past signal changed due to future data. This is expected with a random strategy but otherwise proceed with caution or reevaluate your strategy."

# Check two rows back for feedforward bias
secondToLastSignal = df['signal'].iloc[-2]
thirdToLastSignal = df['signal'].iloc[-3]

# Remove last row and reapply strategy
df_trimmed1 = df.iloc[:-1].copy()
df_trimmed1 = strategy(df_trimmed1)
df_trimmed1['signal'] = df_trimmed1['signal'].ffill().fillna(0)

if df_trimmed1['signal'].iloc[-1] != secondToLastSignal or df_trimmed1['signal'].iloc[-2] != thirdToLastSignal:
    warning = warningMsg

# Remove last two rows and reapply strategy
df_trimmed2 = df.iloc[:-2].copy()
df_trimmed2 = strategy(df_trimmed2)
df_trimmed2['signal'] = df_trimmed2['signal'].ffill().fillna(0)

if df_trimmed2['signal'].iloc[-1] != thirdToLastSignal:
    warning = warningMsg

df = df[df['timestamp'] >= ${dateToCompare}]

signalToReturn = df[['signal']].round(3).to_dict('list')

colsToExclude = {"open", "close", "high", "low", "volume", "timestamp", "signal"}

middleOutput = {
    "result": signalToReturn,
    "data": df.loc[:, ~df.columns.isin(colsToExclude)].fillna(0).round(4).to_dict('list'),
    "warning": warning
}
output = "${uniqueKey}START${uniqueKey}" + json.dumps(middleOutput) + "${uniqueKey}END${uniqueKey}"

sys.stdout.close()
sys.stdout = original_stdout
print(output)`;

        return m;
    }

}

export default CodeExecutor;