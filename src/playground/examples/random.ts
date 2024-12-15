export const random = 
`import numpy as np

def strategy(data):

    data['signal'] = np.random.choice([-1, 0, 1], size=len(data))
    return data
`