const linReg = `
'''
Simple Linear Regression.

Built on the previous 14 days, then used to predict the next day.
'''

import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def linear_regression(data, window=14):
    """
    Function to implement a simple Linear Regression strategy
    for time series data (e.g., stock closing prices).
    """
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
    """
    Implements a trading strategy that uses Linear Regression for signals.
    """
    # Call the linear_regression function to get the signals
    data['signal'], data['prediction'] = linear_regression(data)

    return data
`;

export default linReg;