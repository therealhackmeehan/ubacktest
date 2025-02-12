export const rsiEma =
    `'''
Buy Low, Sell High (Smoothed RSI).

Sell stock when the Relative Strength Index (RSI) crosses above 70.
Buy stock when the RSI crosses below 30.
Uses an Exponential Moving Average (EMA) for smoothing RSI calculation.
'''

import pandas as pd

def calculate_rsi_ema(series, window=14):
    delta = series.diff()

    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.ewm(span=window, adjust=False).mean()
    avg_loss = loss.ewm(span=window, adjust=False).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi

def strategy(data):
    data['RSI'] = calculate_rsi_ema(data['close'], window=14)

    # Generate signals
    data['signal'] = data['RSI'].apply(lambda x: 1 if x > 70 else -1 if x < 30 else 0)

    return data
`