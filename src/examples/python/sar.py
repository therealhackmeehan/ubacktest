'''
Parabolic SAR Strategy.

Buy when the Parabolic SAR is below the price (bullish trend).
Sell when the Parabolic SAR is above the price (bearish trend).
The Parabolic SAR helps capture strong trends by providing entry and exit signals.
'''

import pandas as pd

def calculate_parabolic_sar(data, step=0.02, max_step=0.2):
    sar = data['close'].copy()
    af = step
    ep = data['high'].max()
    sar[0] = data['low'].iloc[0]  # Initial value of SAR
    for i in range(1, len(data)):
        sar[i] = sar[i-1] + af * (ep - sar[i-1])
        if data['close'].iloc[i] > sar[i-1]:
            ep = data['high'].iloc[i]
            af = min(af + step, max_step)
        else:
            ep = data['low'].iloc[i]
            af = min(af + step, max_step)
    return sar

def strategy(data):
    data['SAR'] = calculate_parabolic_sar(data)

    # Generate signals based on SAR trend
    data['signal'] = 0
    data.loc[data['close'] > data['SAR'], 'signal'] = 1  # Buy signal
    data.loc[data['close'] < data['SAR'], 'signal'] = -1  # Sell signal

    return data
