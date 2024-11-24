interface MainProps {
    data: string;
    uniqueKey: string;
    colToTest: string;
}

export default function main_py({ data, uniqueKey, colToTest }: MainProps): string {

    const m =
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

if 'portfolio' in df.columns:
    raise Exception("Sorry, you cannot have a column named portfolio, as that is reserved for analysis on our end")

if 'returns' in df.columns:
    raise Exception("Sorry, you cannot have a column named portfolio, as that is reserved for analysis on our end")

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

df['returns'] = df['signal'] * df['${colToTest}'].pct_change()
df['returns'] = df['returns'].shift(-1)
df['returns'].fillna(0, inplace=True)
df['portfolio'] = df['${colToTest}'].iloc[0] * (1 + df['returns'].cumsum())
dfToReturn = df[['signal', 'returns', 'portfolio']].to_dict('list')

print("${uniqueKey}START${uniqueKey}" + json.dumps(dfToReturn) + "${uniqueKey}END${uniqueKey}")`;

    return m
}