'''
TEMA Crossover Strategy.

Buy when the price crosses above the Triple Exponential Moving Average (TEMA).
Short when the price crosses below the TEMA.
TEMA smoothes price data to give clearer signals and reduce lag.
Learn more @ docs.ubacktest.com/examples/moving-averages/tema
'''

import pandas as pd

def calculate_tema(data, window=14):
    ema1 = data['close'].ewm(span=window, adjust=False).mean()
    ema2 = ema1.ewm(span=window, adjust=False).mean()
    ema3 = ema2.ewm(span=window, adjust=False).mean()
    tema = 3 * (ema1 - ema2) + ema3
    return tema

def strategy(data):
    data['TEMA'] = calculate_tema(data)

    # Generate signals based on TEMA crossover
    data['signal'] = 0
    data.loc[data['close'] > data['TEMA'], 'signal'] = 1  # Buy signal (cross above)
    data.loc[data['close'] < data['TEMA'], 'signal'] = -1  # Short signal (cross below)

    return data
