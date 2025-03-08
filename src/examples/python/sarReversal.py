'''
Parabolic SAR Trend Reversal Strategy.

Buy when the price crosses above the Parabolic SAR (bullish reversal).
Sell when the price crosses below the Parabolic SAR (bearish reversal).
Parabolic SAR helps identify potential trend reversals.
'''

import pandas as pd

def calculate_parabolic_sar(data, step=0.02, max_step=0.2):
    sar = data['close'].copy()
    uptrend = True
    ep = data['high'].max()  # Extreme point
    af = step  # Acceleration factor
    sar.iloc[0] = data['low'].iloc[0]
    
    for i in range(1, len(data)):
        sar.iloc[i] = sar.iloc[i-1] + af * (ep - sar.iloc[i-1])
        
        if uptrend:
            sar.iloc[i] = min(sar.iloc[i], data['low'].iloc[i-1])  # Prevent SAR from going below previous low
            if data['close'].iloc[i] < sar.iloc[i]:
                uptrend = False
                ep = data['low'].iloc[i]  # Switch to downtrend
                sar.iloc[i] = ep
        else:
            sar.iloc[i] = max(sar.iloc[i], data['high'].iloc[i-1])  # Prevent SAR from going above previous high
            if data['close'].iloc[i] > sar.iloc[i]:
                uptrend = True
                ep = data['high'].iloc[i]  # Switch to uptrend
                sar.iloc[i] = ep
                
        af = min(af + step, max_step)
    
    return sar

def strategy(data):
    data['SAR'] = calculate_parabolic_sar(data)

    # Generate signals based on Parabolic SAR crossovers
    data['signal'] = 0
    data.loc[data['close'] > data['SAR'], 'signal'] = 1  # Buy signal
    data.loc[data['close'] < data['SAR'], 'signal'] = -1  # Sell signal

    return data
