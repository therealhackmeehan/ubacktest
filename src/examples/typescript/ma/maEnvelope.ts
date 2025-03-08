export const maEnvelope =

    `'''
Moving Average Envelope Strategy.

Buy when the price touches the lower envelope band and moves up.
Short when the price touches the upper envelope band and moves down.
This strategy uses a percentage-based envelope around a moving average.
'''

import pandas as pd

def calculate_moving_average_envelope(series, window=20, envelope_pct=2.0):
    sma = series.rolling(window=window).mean()
    upper_band = sma * (1 + envelope_pct / 100)
    lower_band = sma * (1 - envelope_pct / 100)
    return sma, upper_band, lower_band

def strategy(data):
    data['SMA'], data['Upper_Band'], data['Lower_Band'] = calculate_moving_average_envelope(data['close'])

    # Generate signals based on price touching the envelope bands
    # Initialize 'signal' column
    data['signal'] = np.nan  # Start with NaN
    data.loc[data['close'] <= data['Lower_Band'], 'signal'] = 1  # Buy
    data.loc[data['close'] >= data['Upper_Band'], 'signal'] = -1  # Short

    # Forward fill to propagate positions
    data['signal'] = data['signal'].ffill().fillna(0)

    return data
`;