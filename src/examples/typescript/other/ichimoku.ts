export const ichimoku =
    `'''
Ichimoku Cloud Strategy.

Buy when the Conversion Line crosses above the Base Line and the price is above the cloud.
Short when the Conversion Line crosses below the Base Line and the price is below the cloud.
The Ichimoku Cloud provides insights into trend direction and momentum.
Learn more @ docs.ubacktest.com/examples/
'''

import pandas as pd
import numpy as np

def calculate_ichimoku(data):

    # Tenkan-sen (Conversion Line) - 9-period high/low midpoint
    # Kijun-sen (Base Line) - 26-period high/low midpoint
    # Senkou Span A (Leading Span A) - Midpoint of Tenkan-sen and Kijun-sen, shifted forward 26 periods
    # Senkou Span B (Leading Span B) - 52-period high/low midpoint, shifted forward 26 periods
    # Chikou Span (Lagging Span) - Closing price shifted 26 periods back

    data['Tenkan_sen'] = (data['high'].rolling(9).max() + data['low'].rolling(9).min()) / 2
    data['Kijun_sen'] = (data['high'].rolling(26).max() + data['low'].rolling(26).min()) / 2
    data['Senkou_Span_A'] = ((data['Tenkan_sen'] + data['Kijun_sen']) / 2).shift(26)
    data['Senkou_Span_B'] = ((data['high'].rolling(52).max() + data['low'].rolling(52).min()) / 2).shift(26)
    data['Chikou_Span'] = data['close'].shift(-26)

    return data

def strategy(data):

    data = calculate_ichimoku(data)

    # Generate signals based on Ichimoku Cloud principles
    data['signal'] = np.nan
    
    # Bullish Signal: Price above cloud, Tenkan-sen above Kijun-sen, Chikou Span above price 26 days ago
    data.loc[
        (data['close'] > data['Senkou_Span_A']) &
        (data['close'] > data['Senkou_Span_B']) &
        (data['Tenkan_sen'] > data['Kijun_sen']) &
        (data['Chikou_Span'] > data['close'].shift(26)),
        'signal'
    ] = 1  # Buy signal

    # Bearish Signal: Price below cloud, Tenkan-sen below Kijun-sen, Chikou Span below price 26 days ago
    data.loc[
        (data['close'] < data['Senkou_Span_A']) &
        (data['close'] < data['Senkou_Span_B']) &
        (data['Tenkan_sen'] < data['Kijun_sen']) &
        (data['Chikou_Span'] < data['close'].shift(26)),
        'signal'
    ] = -1  # Sell/Short signal

    return data`