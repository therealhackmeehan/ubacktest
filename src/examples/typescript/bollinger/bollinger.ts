export const bollinger_breakout =
    `'''
Bollinger Bands Breakout Strategy.

Buy stock when the price breaks above the upper Bollinger Band.
Sell stock when the price breaks below the lower Bollinger Band.
This strategy assumes trend continuation.

'''

import pandas as pd
import numpy as np

def calculate_bollinger_bands(series, window=20, num_std=2):
    sma = series.rolling(window=window).mean()
    std = series.rolling(window=window).std()
    
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)

    return upper_band, lower_band

def strategy(data):
    data['Upper_Band'], data['Lower_Band'] = calculate_bollinger_bands(data['close'], window=20)

    # Initialize 'signal' column
    data['signal'] = np.nan  # Start with NaN

    # Buy when price breaks above upper band
    data.loc[(data['close'].shift(1) <= data['Upper_Band'].shift(1)) & (data['close'] > data['Upper_Band']), 'signal'] = 1

    # Sell when price breaks below lower band
    data.loc[(data['close'].shift(1) >= data['Lower_Band'].shift(1)) & (data['close'] < data['Lower_Band']), 'signal'] = -1

    # Forward fill to propagate positions
    data['signal'] = data['signal'].ffill().fillna(0)

    return data`