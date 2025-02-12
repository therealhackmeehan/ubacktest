export const rsiVolume =
    `
'''
Buy Low, Sell High with Volume Confirmation.

Sell stock when RSI crosses above 70 **and** volume is above its 50-day average.
Buy stock when RSI crosses below 30 **and** volume is above its 50-day average.
This ensures strong momentum behind the signals.
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
    data['Avg_Volume'] = data['volume'].rolling(window=50).mean()

    # Generate signals with volume confirmation
    data['signal'] = data.apply(
        lambda row: 1 if row['RSI'] > 70 and row['volume'] > row['Avg_Volume'] 
        else -1 if row['RSI'] < 30 and row['volume'] > row['Avg_Volume'] 
        else 0, axis=1
    )

    return data
`