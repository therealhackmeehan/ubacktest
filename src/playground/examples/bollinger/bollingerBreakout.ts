export const bollingerBreakout =
    `'''
Bollinger Band Breakout Strategy.

Buy stock when the price breaks above the upper Bollinger Band.
Sell stock when the price breaks below the lower Bollinger Band.
This strategy assumes strong momentum continues in the breakout direction.
'''

import pandas as pd

def calculate_bollinger_bands(series, window=20, num_std=2):
    sma = series.rolling(window=window).mean()
    std = series.rolling(window=window).std()
    
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)

    return upper_band, lower_band

def strategy(data):
    data['Upper_Band'], data['Lower_Band'] = calculate_bollinger_bands(data['close'], window=20)

    # Generate signals for breakouts
    data['signal'] = data.apply(
        lambda row: 1 if row['close'] > row['Upper_Band'] 
        else -1 if row['close'] < row['Lower_Band'] 
        else 0, axis=1
    )

    return data
`