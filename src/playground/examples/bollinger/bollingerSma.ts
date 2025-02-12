export const bollingerSma =
    `'''
Bollinger Bands Strategy with Moving Average Confirmation.

Sell stock when the price is above the upper Bollinger Band **and** below the 50-day SMA.
Buy stock when the price is below the lower Bollinger Band **and** above the 50-day SMA.
This ensures we trade in the direction of the larger trend.
'''

import pandas as pd

def calculate_bollinger_bands(series, window=20, num_std=2):
    sma = series.rolling(window=window).mean()
    std = series.rolling(window=window).std()
    
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)

    return upper_band, lower_band

def calculate_sma(series, window=50):
    return series.rolling(window=window).mean()

def strategy(data):
    data['Upper_Band'], data['Lower_Band'] = calculate_bollinger_bands(data['close'], window=20)
    data['SMA_50'] = calculate_sma(data['close'], window=50)

    # Generate signals with trend confirmation
    data['signal'] = data.apply(
        lambda row: 1 if row['close'] <= row['Lower_Band'] and row['close'] > row['SMA_50'] 
        else -1 if row['close'] >= row['Upper_Band'] and row['close'] < row['SMA_50'] 
        else 0, axis=1
    )

    return data
`