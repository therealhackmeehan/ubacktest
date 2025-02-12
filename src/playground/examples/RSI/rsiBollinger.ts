export const rsiBollinger = `
'''
Buy Low, Sell High with Bollinger Bands.

Sell stock when RSI crosses above 70 **and** the price is near the upper Bollinger Band.
Buy stock when RSI crosses below 30 **and** the price is near the lower Bollinger Band.
This helps avoid false RSI signals in ranging markets.
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

def calculate_bollinger_bands(series, window=20, num_std=2):
    sma = series.rolling(window=window).mean()
    std = series.rolling(window=window).std()
    
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)

    return upper_band, lower_band

def strategy(data):
    data['RSI'] = calculate_rsi(data['close'], window=14)
    data['Upper_Band'], data['Lower_Band'] = calculate_bollinger_bands(data['close'], window=20)

    # Generate signals with Bollinger Band confirmation
    data['signal'] = data.apply(
        lambda row: 1 if row['RSI'] > 70 and row['close'] >= row['Upper_Band'] 
        else -1 if row['RSI'] < 30 and row['close'] <= row['Lower_Band'] 
        else 0, axis=1
    )

    return data
`