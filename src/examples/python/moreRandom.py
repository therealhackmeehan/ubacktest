'''
(More) Random Strategy.

For every date, choose a random float value between -1 and 1.
'''

import numpy as np

def strategy(data):

    data['signal'] = np.random.uniform(-1, 1, size=len(data))
    return data