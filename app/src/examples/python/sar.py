'''
Parabolic SAR Strategy.

Buy when the Parabolic SAR is below the price (bullish trend).
Sell when the Parabolic SAR is above the price (bearish trend).
The Parabolic SAR helps capture strong trends by providing entry and exit signals.
Learn more @ docs.ubacktest.com/examples/other-indicators/sar
'''

import pandas as pd
import numpy as np

def calculate_parabolic_sar(data, step=0.02, max_step=0.2):

    sar = np.full(len(data), np.nan)  # Initialize SAR values
    af = step  # Acceleration Factor starts at 0.02

    # set first SAR point to NaN. We need to warm up two days before calculating SAR
    sar[0] = np.nan

    # Determine initial trend direction
    uptrend = data['close'][1] > data['close'][0]  # If close[1] > close[0], assume uptrend

    # Set Initial SAR and Extreme Point (EP)
    if uptrend:
        sar[1] = data['low'][0]  # Start SAR at the first low
        ep = data['high'][0]  # Highest high in the trend
    else:
        sar[2] = data['high'][0]  # Start SAR at the first high
        ep = data['low'][0]  # Lowest low in the trend

    for i in range(2, len(data)):
        # Update SAR
        sar[i] = sar[i - 1] + af * (ep - sar[i - 1])

        # Ensure SAR does not move beyond last two period's high/low
        if uptrend:
            sar[i] = min(sar[i], data['low'][i - 1], data['low'][i - 2])  # Cannot exceed prior lows
        else:
            sar[i] = max(sar[i], data['high'][i - 1], data['high'][i - 2])  # Cannot drop below prior highs

        # Update EP & AF if new extreme point is reached
        if uptrend:
            if data['high'][i] > ep:  # New high in an uptrend
                ep = data['high'][i]
                af = min(af + step, max_step)  # Increase AF
        else:
            if data['low'][i] < ep:  # New low in a downtrend
                ep = data['low'][i]
                af = min(af + step, max_step)  # Increase AF

        # Check for trend reversal
        if uptrend and data['low'][i] < sar[i]:
            uptrend = False
            sar[i] = ep  # Reset SAR to last EP
            ep = data['low'][i]  # Start tracking new low
            af = step  # Reset AF
        elif not uptrend and data['high'][i] > sar[i]:
            uptrend = True
            sar[i] = ep  # Reset SAR to last EP
            ep = data['high'][i]  # Start tracking new high
            af = step  # Reset AF

    return sar

def strategy(data):
    data['SAR'] = calculate_parabolic_sar(data)

    # Generate signals based on SAR trend
    data['signal'] = 0
    data.loc[data['close'] > data['SAR'], 'signal'] = 1  # Buy signal
    data.loc[data['close'] < data['SAR'], 'signal'] = -1  # Sell signal

    return data
