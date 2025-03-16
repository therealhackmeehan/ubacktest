const expReg = `
'''
Exponential Regression Strategy.

Trains an Exponential Regression model using the past 14 days of data to predict the next day's price movement (up/down).
'''

import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def exponential_regression(data, window=5):

    signals = np.zeros(len(data))  # Initialize signals array
    predictions = np.zeros(len(data)) # Initialize predictions array
    
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
        prediction = np.exp(prediction_log[0])  # Apply exponential to get back to the original scale
        predictions[i] = prediction

        # Signal generation based on prediction (uptrend or downtrend)
        if prediction > data['close'][i-1]:
            signals[i] = 1  # Buy signal
        else:
            signals[i] = -1  # Sell signal
    
    return signals, predictions

def strategy(data):

    # Call the exponential_regression function to get the signals
    data['signal'], data['prediction'] = exponential_regression(data)

    return data
`;

export default expReg;
