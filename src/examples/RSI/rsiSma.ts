export const rsiSma =
    `'''
Buy Low, Sell/Short High with Trend Confirmation.

Short stock when RSI crosses above 70 **and** the stock is below its 50-day SMA.
Buy stock when RSI crosses below 30 **and** the stock is above its 50-day SMA.
This helps reduce false signals in volatile markets.
'''

import pandas as pd

def calculate_rsi(series, window=14):
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
    data['SMA_50'] = data['close'].rolling(window=50).mean()

    # Generate signals with SMA confirmation
    data['signal'] = data.apply(
        lambda row: 1 if row['RSI'] > 70 and row['close'] < row['SMA_50'] 
        else -1 if row['RSI'] < 30 and row['close'] > row['SMA_50'] 
        else 0, axis=1
    )

    return data
`