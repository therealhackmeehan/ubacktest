export const scaledRsi =
    `'''
Scaled Buy Low, Sell High.

Buy/Sell proportional to how low or high the RSI is.
I.E. buy a lot when really low, sell a lot when really high.
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

    # Scaled signal: -1 to 1 range, based on RSI deviation from 50
    data['signal'] = (50 - data['RSI']) / 50  # Closer to -1 is Strong Sell, Closer to 1 is Strong Buy

    return data
`