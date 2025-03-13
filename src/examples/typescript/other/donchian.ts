export const donchianChannel =
    `'''
Donchian Channel Breakout Strategy.

Buy when the price breaks above the 20-day high.
Short when the price breaks below the 20-day low.
This strategy aims to capture breakout momentum.
'''

import pandas as pd
import numpy as np

def calculate_donchian(series, window):
    # Calculate both high and low Donchian Channel values and shift them by 1 to capture previous n days' high/low
    return series.rolling(window=window).max().shift(1), series.rolling(window=window).min().shift(1)

def strategy(data):
    # Calculate Donchian High and Low in one step
    data['Donchian_High'], data['Donchian_Low'] = calculate_donchian(data['close'], window=20)

    # Generate breakout signals
    data['signal'] = np.nan
    data.loc[data['close'] > data['Donchian_High'], 'signal'] = 1
    data.loc[data['close'] < data['Donchian_Low'], 'signal'] = -1

    return data
`
