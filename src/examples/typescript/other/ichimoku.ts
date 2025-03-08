export const ichimoku =
    `'''
Ichimoku Cloud Breakout Strategy.

Buy when the Conversion Line crosses above the Base Line and the price is above the cloud.
Sell when the Conversion Line crosses below the Base Line and the price is below the cloud.
The Ichimoku Cloud provides insights into trend direction and momentum.
'''

import pandas as pd

def calculate_ichimoku(data):
    nine_period_high = data['high'].rolling(window=9).max()
    nine_period_low = data['low'].rolling(window=9).min()
    data['Conversion_Line'] = (nine_period_high + nine_period_low) / 2  # Tenkan-sen
    period26_high = data['high'].rolling(window=26).max()
    period26_low = data['low'].rolling(window=26).min()
    data['Base_Line'] = (period26_high + period26_low) / 2  # Kijun-sen
    return data

def strategy(data):
    data = calculate_ichimoku(data)

    # Generate signals based on Ichimoku Cloud breakout
    #data['signal'] = 0
    #data.loc[(data['Conversion_Line'] > data['Base_Line']) & (data['close'] > data['Conversion_Line']), 'signal'] = 1  # Buy signal
    #data.loc[(data['Conversion_Line'] < data['Base_Line']) & (data['close'] < data['Base_Line']), 'signal'] = -1  # Sell signal

    # Initialize signal column
    data['signal'] = 0

    # hold the current position until the next crossing occurs.
    for i in range(1, len(data)):
        if (data['Conversion_Line'] > data['Base_Line']) and (data['close'] > data['Conversion_Line']):
            data.loc[i:, 'signal'] = 1
        elif (data['Conversion_Line'] < data['Base_Line']) and (data['close'] < data['Base_Line']):
            data.loc[i:, 'signal'] = -1

    return data
`