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
    raise Exception("Sorry, you cannot have a column named returns, as that is reserved for analysis on our end")

if (df.columns == 'signal').sum() > 1:
    raise Exception("There are two or more 'signal' columns in the table.")

if df['signal'].empty:
    raise Exception("'signal' column is empty.")

if df['signal'].isnull().any():
    raise Exception("'signal' column contains null values.")

if not df.index.is_unique:
    raise Exception("Table index is not unique.")

if df.shape[0] != initHeight:
    raise Exception("The height of the dataframe has changed upon applying your strategy.")

df['returns'] = df['${colToTest}'].pct_change().shift(-1)
df.at[df.index[-1], 'returns'] = 0
df['returns'] = df['returns']*df['signal']

if df['returns'].isnull().any():
    raise Exception("The calculated returns contain NaN values.")

df['portfolio'] = df['${colToTest}'].iloc[0] * (1 + df['returns']).cumprod()

if df['portfolio'].isnull().any():
    raise Exception("The calculated portfolio contains NaN values.")

if (df['portfolio'] < 0).any():
    raise Exception("Your portfolio contains negative values, which means something has gone wrong.")

df[['signal', 'returns', 'portfolio']] = df[['signal', 'returns', 'portfolio']].round(3)
dfToReturn = df[['signal', 'returns', 'portfolio']].to_dict('list')

print("${uniqueKey}START${uniqueKey}" + json.dumps(dfToReturn) + "${uniqueKey}END${uniqueKey}")`;

    return m
}