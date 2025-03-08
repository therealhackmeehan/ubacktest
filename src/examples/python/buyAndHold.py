'''
Classic Buy & Hold Strategy.

Set a buy signal to every date.
'''

def strategy(data):

    data['signal'] = 1
    return data