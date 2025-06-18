'''
Polynomial Regression Strategy.

Trains a Polynomial Regression model using the past 14 days of data to predict the next day's price movement (up/down).
Learn more @ docs.ubacktest.com/examples/regression/polyreg
'''

import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

def polynomial_regression(data, window=14, degree=2):

    signals = np.zeros(len(data))  # Initialize signals array
    predictions = np.zeros(len(data)) # Initialize predictions array
    
    # Iterate over the data starting from the window index
    for i in range(window, len(data)):
        # Prepare the features (X) and target (y) for the regression model
        X = np.array(range(i-window, i)).reshape(-1, 1)  # Time index for the last window days
        y = data['close'][i-window:i].values  # Last window closing prices
        
        # Transform the features into polynomial features (degree=2 for quadratic)
        poly = PolynomialFeatures(degree)
        X_poly = poly.fit_transform(X)  # Transform the data to polynomial features
        
        # Fit the polynomial model (using LinearRegression)
        model = LinearRegression()
        model.fit(X_poly, y)
        
        # Predict the next value (for the current time period)
        prediction = model.predict(poly.transform(np.array([[i]])))  # Predict the next point (i.e., the 6th day)
        predictions[i] = prediction[0]

        # Signal generation based on prediction (uptrend or downtrend)
        if prediction > data['close'][i-1]:
            signals[i] = 1  # Buy signal
        else:
            signals[i] = -1  # Sell signal
    
    return signals, predictions

def strategy(data):

    # Set Fit to Quadratic (Change if you wish)
    degree = 2

    # Call the polynomial_regression function to get the signals
    data['signal'], data['prediction'] = polynomial_regression(data, degree)

    return data
