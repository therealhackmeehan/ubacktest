export const maEnvelope =

    `'''
Moving Average Envelope Strategy.

Buy when the price touches the lower envelope band and moves up.
Short when the price touches the upper envelope band and moves down.
This strategy uses a percentage-based envelope around a moving average.
Learn more @ docs.ubacktest.com/examples/
'''

import pandas as pd
import numpy as np

def calculate_moving_average_envelope(series, window=20, envelope_pct=2.0):
    sma = series.rolling(window=window).mean()
    upper_band = sma * (1 + envelope_pct / 100)
    lower_band = sma * (1 - envelope_pct / 100)
    return sma, upper_band, lower_band

def strategy(data):
    data['SMA'], data['Upper_Band'], data['Lower_Band'] = calculate_moving_average_envelope(data['close'])

    # Initialize 'signal' column
    data['signal'] = np.nan
    data.loc[data['close'] <= data['Lower_Band'], 'signal'] = 1  # Buy
    data.loc[data['close'] >= data['Upper_Band'], 'signal'] = -1  # Short

    return data
`;