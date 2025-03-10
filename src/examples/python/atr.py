'''
ATR Breakout Strategy.

Buy when the price breaks above the previous high + ATR * multiplier.
Short when the price breaks below the previous low - ATR * multiplier.
This strategy captures volatility breakouts with dynamic stop-loss levels.
'''

import pandas as pd
import numpy as np

def calculate_atr(data, window=14):
    high_low = data['high'] - data['low']
    high_close = (data['high'] - data['close'].shift(1)).abs()
    low_close = (data['low'] - data['close'].shift(1)).abs()
    tr = pd.concat([high_low, high_close, low_close], axis=1)
    atr = tr.max(axis=1).rolling(window=window).mean()
    return atr

def strategy(data):

    atr_multiplier = 2
    data['ATR'] = calculate_atr(data)

    # Generate breakout signals based on ATR
    data['signal'] = np.nan
    data.loc[data['close'] > (data['high'].shift(1) + data['ATR'] * atr_multiplier), 'signal'] = 1  # Buy signal
    data.loc[data['close'] < (data['low'].shift(1) - data['ATR'] * atr_multiplier), 'signal'] = -1  # Short signal

    # Forward fill to propagate positions
    data['signal'] = data['signal'].ffill().fillna(0)

    return data
