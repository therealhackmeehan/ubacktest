export const rsi =
    `'''
Buy Low, Sell High.

Sell stock when the Relative Strength Index (RSI) cracks above 70.
Buy stock when the RSI breaks below 30.
'''

import pandas as pd

def calculate_rsi(series, window):
    delta = series.diff()

    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(window=window, min_periods=1).mean()
    avg_loss = loss.rolling(window=window, min_periods=1).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi

def strategy(data):
    data['RSI'] = calculate_rsi(data['close'], window=14)

    # Generate signals
    data['signal'] = data['RSI'].apply(lambda x: 1 if x > 70 else -1 if x < 30 else 0)

    return data
`