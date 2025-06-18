'''
Lasso Regression Strategy.

Trains a Lasso Regression model using the past 14 days of data to predict the next day's price movement (up/down).
Learn more @ docs.ubacktest.com/examples/regression/lassoreg
'''

import pandas as pd
from sklearn.linear_model import Lasso
import numpy as np

def lasso_regression(data, window=14, alpha=1.0):

    signals = np.zeros(len(data))  # Initialize signals array
    predictions = np.zeros(len(data)) # Initialize predictions array
    
    # Iterate over the data starting from the window index
    for i in range(window, len(data)):
        # Prepare the features (X) and target (y) for the regression model
        X = np.array(range(i-window, i)).reshape(-1, 1)  # Time index for the last window days
        y = data['close'][i-window:i].values  # Last window closing prices
        
        # Fit the Lasso regression model (using L1 regularization)
        model = Lasso(alpha=alpha)  # 'alpha' is the regularization strength
        model.fit(X, y)
        
        # Predict the next value (for the current time period)
        prediction = model.predict(np.array([[i]]))  # Predict the next point (i.e., the 6th day)
        predictions[i] = prediction[0]

        # Signal generation based on prediction (uptrend or downtrend)
        if prediction > data['close'][i-1]:
            signals[i] = 1  # Buy signal
        else:
            signals[i] = -1  # Sell signal
    
    return signals, predictions

def strategy(data):

    # Call the lasso_regression function to get the signals
    data['signal'], data['prediction'] = lasso_regression(data)

    return data
