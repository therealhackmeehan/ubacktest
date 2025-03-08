export const shortAndHold = 
`'''
Short and Hold Strategy.

For every date, assign a shorted position of -1.
'''

def strategy(data):

    data['signal'] = -1
    return data`