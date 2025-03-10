export const adx =
    `'''
ADX Trend Strength Strategy.

Buy when the +DI crosses above the -DI and the ADX is above 25 (strong uptrend).
Short when the -DI crosses above the +DI and the ADX is above 25 (strong downtrend).
The ADX helps to confirm the strength of a trend.
'''

import pandas as pd
import numpy as np

def calculate_adx(data, window=14):
    high = data['high']
    low = data['low']
    close = data['close']

    up_move = high.diff()
    down_move = low.diff().abs()

    plus_dm = (up_move.where(up_move > down_move, 0)).rolling(window=window).sum()
    minus_dm = (down_move.where(down_move > up_move, 0)).rolling(window=window).sum()

    tr = pd.concat([high - low, (high - close.shift()).abs(), (low - close.shift()).abs()], axis=1).max(axis=1)
    atr = tr.rolling(window=window).mean()

    plus_di = (plus_dm / atr) * 100
    minus_di = (minus_dm / atr) * 100
    adx = (abs(plus_di - minus_di) / (plus_di + minus_di)).rolling(window=window).mean() * 100

    return plus_di, minus_di, adx

def strategy(data):
    data['+DI'], data['-DI'], data['ADX'] = calculate_adx(data)

    # Generate signals based on ADX trend strength
    data['signal'] = np.nan
    data.loc[(data['+DI'] > data['-DI']) & (data['ADX'] > 25), 'signal'] = 1  # Buy signal
    data.loc[(data['-DI'] > data['+DI']) & (data['ADX'] > 25), 'signal'] = -1  # Short signal

    # Forward fill to propagate positions
    data['signal'] = data['signal'].ffill().fillna(0)

    return data
`