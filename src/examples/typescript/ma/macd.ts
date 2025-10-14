export const macd = `'''
MACD Crossover Strategy.

Buy when the MACD crosses above the signal line.
Short when the MACD crosses below the signal line.
This strategy uses the MACD for identifying momentum changes.
Learn more @ docs.ubacktest.com/examples/moving-averages/macd
'''

import pandas as pd

def calculate_macd(series, short_window=12, long_window=26, signal_window=9):

    # generate two MAs and return the smoothed difference as a signal line
    short_ema = series.ewm(span=short_window, adjust=False).mean()
    long_ema = series.ewm(span=long_window, adjust=False).mean()
    macd = short_ema - long_ema
    
    signal = macd.ewm(span=signal_window, adjust=False).mean()
    return macd, signal

def strategy(data):
    data['MACD'], data['Signal_Line'] = calculate_macd(data['close'])

    # Generate signals based on MACD crossover
    data['signal'] = 0
    data.loc[data['MACD'] > data['Signal_Line'], 'signal'] = 1  # Buy
    data.loc[data['MACD'] < data['Signal_Line'], 'signal'] = -1 # Short

    return data
`;
