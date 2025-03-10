'''
Ichimoku Cloud Breakout Strategy.

Buy when the Conversion Line crosses above the Base Line and the price is above the cloud.
Short when the Conversion Line crosses below the Base Line and the price is below the cloud.
The Ichimoku Cloud provides insights into trend direction and momentum.
'''

import pandas as pd
import numpy as np

def calculate_ichimoku(data):
    nine_period_high = data['high'].rolling(window=9).max().shift()
    nine_period_low = data['low'].rolling(window=9).min().shift()
    data['Conversion_Line'] = (nine_period_high + nine_period_low) / 2  # Tenkan-sen
    period26_high = data['high'].rolling(window=26).max().shift()
    period26_low = data['low'].rolling(window=26).min().shift()
    data['Base_Line'] = (period26_high + period26_low) / 2  # Kijun-sen
    return data

def strategy(data):
    data = calculate_ichimoku(data)

    # Generate signals based on Ichimoku Cloud breakout
    data['signal'] = np.nan
    data.loc[(data['Conversion_Line'] > data['Base_Line']) & (data['close'] > data['Conversion_Line']), 'signal'] = 1  # Buy signal
    data.loc[(data['Conversion_Line'] < data['Base_Line']) & (data['close'] < data['Base_Line']), 'signal'] = -1  # Short signal

    # Forward fill to propagate positions
    data['signal'] = data['signal'].ffill().fillna(0)    

    return data
