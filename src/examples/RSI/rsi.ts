export const rsi =
    `'''
Buy Low, Sell/Short High.

Buy stock when the RSI breaks below 30.
Short stock when the Relative Strength Index (RSI) cracks above 70.
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

    # Initialize signal column
    data['signal'] = 0

    # hold the current position until the next crossing occurs.
    for i in range(1, len(data)):
        if data['RSI'][i-1] > 30 and data['RSI'][i] < 30:
            data.loc[i:, 'signal'] = 1
        elif data['RSI'][i-1] < 70 and data['RSI'][i] > 70:
            data.loc[i:, 'signal'] = 1

    return data
`