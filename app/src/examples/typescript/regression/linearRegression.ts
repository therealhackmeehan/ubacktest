export const linReg = `'''
Simple Linear Regression.

Trains an Linear Regression model using the past 14 days of data to predict the next day's price movement (up/down).
Learn more @ docs.ubacktest.com/examples/regression/linreg
'''

import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def linear_regression(data, window=14):

    signals = np.zeros(len(data))  # Initialize signals array
    predictions = np.zeros(len(data)) # Initialize predictions array
    
    # Iterate over the data starting from the window index
    for i in range(window, len(data)):
        # Prepare the features (X) and target (y) for the regression model
        X = np.array(range(i-window, i)).reshape(-1, 1)  # Time index for the last window days
        y = data['close'][i-window:i]  # Last window closing prices
        
        # Fit the model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict the next value (for the current time period)
        prediction = model.predict(np.array([[i]]))  # Predict the next point (i.e., the 15th day)
        predictions[i] = prediction[0]
        
        # Signal generation based on prediction (uptrend or downtrend)
        if prediction > data['close'][i-1]:
            signals[i] = 1  # Buy signal
        else:
            signals[i] = -1  # Sell signal
    
    return signals, predictions

def strategy(data):

    # Call the linear_regression function to get the signals
    data['signal'], data['prediction'] = linear_regression(data)

    return data
`;
