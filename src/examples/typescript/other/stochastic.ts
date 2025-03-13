export const stochastic =
    `'''
Stochastic Oscillator Strategy.

Buy when the %K line crosses above the %D line below 20 (oversold condition).
Short when the %K line crosses below the %D line above 80 (overbought condition).
This strategy helps capture momentum reversals.
'''

import pandas as pd
import numpy as np

def calculate_stochastic_oscillator(data, window=14):

    low_min = data['low'].rolling(window=window).min()
    high_max = data['high'].rolling(window=window).max()
    
    stoch_k = 100 * (data['close'] - low_min) / (high_max - low_min)
    stoch_d = stoch_k.rolling(window=3).mean()  # 3-day moving average of %K
    return stoch_k, stoch_d

def strategy(data):
    data['%K'], data['%D'] = calculate_stochastic_oscillator(data)

    # Generate signals based on stochastic crossover
    data['signal'] = np.nan
    data.loc[(data['%K'] < 20) & (data['%K'] > data['%D']), 'signal'] = 1  # Buy signal
    data.loc[(data['%K'] > 80) & (data['%K'] < data['%D']), 'signal'] = -1  # Short signal

    return data
`