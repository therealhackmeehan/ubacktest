export const scaledBuyLowSellHigh = `'''
Scaled Buy Low, Sell High.

Buy / Sell proportional to how low the stock is.
I.E. buy a lot when really low, sell a lot when really high.
'''
from ta.momentum import RSIIndicator

def strategy(data):

    rsi = RSIIndicator(close=df[column], window=period).rsi()
    data['RSI'] = rsi

    # Create signal based on strength of RSI. 
    data['signal'] = data['RSI'].apply(
        lambda x: (x - 70) / 30 if x > 70 else (x - 30) / 30 if x < 30 else 0
    )

    return data`