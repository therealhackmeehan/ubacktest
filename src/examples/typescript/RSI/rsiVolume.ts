export const rsiVolume =
    `
'''
Buy Low, Sell//Short High with Volume Confirmation.

Short stock when RSI crosses above 70 **and** volume is above its 50-day average.
Buy stock when RSI crosses below 30 **and** volume is above its 50-day average.
This ensures strong momentum behind the signals.
Learn more @ docs.ubacktest.com/examples/
'''

import pandas as pd
import numpy as np

def calculate_rsi(series, window):
    delta = series.diff()

    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(window=window).mean()
    avg_loss = loss.rolling(window=window).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi

def strategy(data):
    data['RSI'] = calculate_rsi(data['close'], window=14)
    data['Avg_Volume'] = data['volume'].rolling(window=50).mean()


    # Initialize 'signal' column
    data['signal'] = np.nan  # Start with NaN

    # Assign signals where RSI crosses threshold
    data.loc[(data['RSI'] < 30) & (data['volume'] > data['Avg_Volume']), 'signal'] = 1
    data.loc[(data['RSI'] > 70) & (data['volume'] > data['Avg_Volume']), 'signal'] = -1

    return data
`