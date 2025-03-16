export const buyAndHold =
    `'''
Classic Buy & Hold Strategy. 

Set a buy signal to every date.
Learn more @ docs.ubacktest.com/examples/
'''

def strategy(data):
    data['signal'] = 1
    return data`