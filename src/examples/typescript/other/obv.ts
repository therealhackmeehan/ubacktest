export const obv =
    `'''
On-Balance Volume (OBV) Strategy.

Buy when the OBV crosses above the 20-day SMA (bullish confirmation).
Short when the OBV crosses below the 20-day SMA (bearish confirmation).
OBV helps to capture momentum with volume as a leading indicator.
'''

import pandas as pd

def calculate_obv(data):
    obv = [0]
    for i in range(1, len(data)):
        if data['close'].iloc[i] > data['close'].iloc[i-1]:
            obv.append(obv[-1] + data['volume'].iloc[i])
        elif data['close'].iloc[i] < data['close'].iloc[i-1]:
            obv.append(obv[-1] - data['volume'].iloc[i])
        else:
            obv.append(obv[-1])
    return pd.Series(obv, index=data.index)

def calculate_sma(series, window=20):
    return series.rolling(window=window).mean()

def strategy(data):
    data['OBV'] = calculate_obv(data)
    data['SMA_20'] = calculate_sma(data['OBV'])

    # Generate signals based on OBV crossover
    data['signal'] = 0
    data.loc[data['OBV'] > data['SMA_20'], 'signal'] = 1  # Buy signal
    data.loc[data['OBV'] < data['SMA_20'], 'signal'] = -1  # Short signal

    return data
`