export const ama = `'''
Adaptive Moving Average (AMA) Strategy.

Buy when the AMA turns upward.
Short when the AMA turns downward.
This strategy adjusts dynamically to market volatility using an efficiency ratio.
'''

import pandas as pd
import numpy as np

def calculate_ama(series, window=10, fast_ema=2, slow_ema=30):
    price_change = abs(series.diff(window))
    volatility = series.diff().abs().rolling(window=window).sum()
    
    efficiency_ratio = price_change / volatility.replace(0, np.nan)
    efficiency_ratio.fillna(0, inplace=True)

    smoothing_constant = (efficiency_ratio * (2 / (fast_ema + 1) - 2 / (slow_ema + 1)) + 2 / (slow_ema + 1)) ** 2
    ama = series.copy()
    for i in range(1, len(series)):
        ama.iloc[i] = ama.iloc[i - 1] + smoothing_constant.iloc[i] * (series.iloc[i] - ama.iloc[i - 1])

    return ama

def strategy(data):
    data['AMA'] = calculate_ama(data['close'])

    # Generate signals based on AMA trend
    data['signal'] = 0
    data.loc[data['AMA'].diff() > 0, 'signal'] = 1  # Buy
    data.loc[data['AMA'].diff() < 0, 'signal'] = -1  # Short

    return data
`;