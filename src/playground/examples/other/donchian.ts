export const donchian =
    `
'''
Donchian Channel Breakout Strategy.

Buy when the price crosses above the upper band (breakout to the upside).
Sell when the price crosses below the lower band (breakout to the downside).
The Donchian Channel identifies breakout points and trend continuation.
'''

import pandas as pd

def calculate_donchian_channel(data, window=20):
    data['Upper_Band'] = data['high'].rolling(window=window).max()
    data['Lower_Band'] = data['low'].rolling(window=window).min()
    return data

def strategy(data):
    data = calculate_donchian_channel(data)

    # Generate signals based on Donchian Channel breakouts
    data['signal'] = 0
    data.loc[data['close'] > data['Upper_Band'], 'signal'] = 1  # Buy signal (breakout)
    data.loc[data['close'] < data['Lower_Band'], 'signal'] = -1  # Sell signal (breakout)

    return data
`