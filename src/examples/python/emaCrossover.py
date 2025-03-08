'''
Exponential Moving Average (EMA) Crossover Strategy.

Buy when the 12-day EMA crosses above the 26-day EMA.
Sell when the 12-day EMA crosses below the 26-day EMA.
EMAs respond faster than SMAs, making this strategy better for short-term trends.
'''

import pandas as pd

def calculate_ema(series, window):
    return series.ewm(span=window, adjust=False).mean()

def strategy(data):
    data['EMA_12'] = calculate_ema(data['close'], window=12)
    data['EMA_26'] = calculate_ema(data['close'], window=26)

    # Generate crossover signals
    data['signal'] = 0
    data.loc[data['EMA_12'] > data['EMA_26'], 'signal'] = 1
    data.loc[data['EMA_12'] < data['EMA_26'], 'signal'] = -1

    return data
