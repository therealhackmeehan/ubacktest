
'''
Exponential Regression.

Built on the previous 5 days, then used to predict the next day.
'''

import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def exponential_regression(data, window=5):
    """
    Function to implement an Exponential Regression strategy
    for time series data (e.g., stock closing prices).
    """
    signals = np.zeros(len(data))  # Initialize signals array
    
    # Iterate over the data starting from the window index
    for i in range(window, len(data)):
        # Prepare the features (X) and target (y) for the regression model
        X = np.array(range(i-window, i)).reshape(-1, 1)  # Time index for the last window days
        y = np.log(data['close'][i-window:i].values)  # Apply log transformation to the closing prices
        
        # Fit the model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict the next value (for the current time period) in the transformed space
        prediction_log = model.predict(np.array([[i]]))  # Predict the next point (i.e., the 6th day)
        
        # Transform the prediction back to the original space
        prediction = np.exp(prediction_log)  # Apply exponential to get back to the original scale
        
        # Signal generation based on prediction (uptrend or downtrend)
        if prediction > data['close'][i-1]:
            signals[i] = 1  # Buy signal
        else:
            signals[i] = -1  # Sell signal
    
    return signals

def strategy(data, window=5):
    """
    Implements a trading strategy that uses Exponential Regression for signals.
    """
    # Call the exponential_regression function to get the signals
    data['signal'] = exponential_regression(data, window)

    return data
