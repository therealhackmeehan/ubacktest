import { PythonDataProps } from "../../shared/sharedTypes";

class ScriptBuilder {

    public static build(code: string, toInsertInPython: PythonDataProps, startDate: string, uniqueKey: string): string {
        const dateToCompare = new Date(startDate).getTime() / 1000;

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

jsonCodeUnformatted = '${JSON.stringify(toInsertInPython)}'
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

df = df[df['timestamp'] >= ${dateToCompare}]

signalToReturn = df[['signal']].round(3).to_dict('list')

colsToExclude = {"open", "close", "high", "low", "volume", "timestamp", "signal"}

middleOutput = {
    "result": signalToReturn,
    "data": df.loc[:, ~df.columns.isin(colsToExclude)].iloc[:, :6].fillna(0).round(4).to_dict('list'),
}
output = "${uniqueKey}START${uniqueKey}" + json.dumps(middleOutput) + "${uniqueKey}END${uniqueKey}"

sys.stdout.close()
sys.stdout = original_stdout
print(output)`;

        return m;
    }
}

export default ScriptBuilder;