'''
Simple Moving Average (SMA) Crossover Strategy.

Buy when the 10-day SMA crosses above the 50-day SMA (golden cross).
Short when the 10-day SMA crosses below the 50-day SMA (death cross).
This strategy captures long-term trends.
Learn more @ docs.ubacktest.com/examples/
'''

import pandas as pd

def calculate_sma(series, window):
    return series.rolling(window=window).mean()

def strategy(data):
    data['SMA_10'] = calculate_sma(data['close'], window=10)
    data['SMA_50'] = calculate_sma(data['close'], window=50)

    # Generate crossover signals
    data['signal'] = 0
    data.loc[data['SMA_10'] > data['SMA_50'], 'signal'] = 1
    data.loc[data['SMA_10'] < data['SMA_50'], 'signal'] = -1

    return data
