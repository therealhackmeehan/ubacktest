'''
Short and Hold Strategy.

For every date, assign a shorted position of -1.
Learn more @ docs.ubacktest.com/examples/intro/shortandhold
'''

def strategy(data):
    data['signal'] = -1
    return data