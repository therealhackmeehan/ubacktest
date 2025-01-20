export const buyLowSellHigh = `'''
Buy Low, Sell High.

Sell stock when the Relative Strength Index (RSI) cracks above 70.
Buy stock when the RSI breaks below 30.
'''
from ta.momentum import RSIIndicator

def strategy(data):

    rsi = RSIIndicator(close=df[column], window=period).rsi()
    data['RSI'] = rsi

    # Insert signals based on RSI thresholds
    data['signal'] = data['RSI'].apply(lambda x: 1 if x > 70 else -1 if x < 30 else 0)

    return data`