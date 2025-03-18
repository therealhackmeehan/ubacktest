
'''
Logistic Regression Strategy.

Trains a Logistic Regression model using the past 30 days of data to predict the next day's price movement (up/down).
Learn more @ docs.ubacktest.com/examples/machine-learning/logreg
'''

import pandas as pd
from sklearn.linear_model import LogisticRegression
import numpy as np

def logistic_regression(data, window=30):

    signals = np.zeros(len(data))  # Initialize signals array

    # Create the target variable: 1 if price goes up the next day, -1 if it goes down
    data['target'] = (data['close'].shift(-1) > data['close']).astype(int) * 2 - 1
    
    # Iterate over the data starting from the window index
    for i in range(window, len(data)):
        # Prepare the features (X) and target (y) for the logistic regression model
        X = np.array(range(i-window, i)).reshape(-1, 1)  # Time index for the last window days
        y = data['target'][i-window:i].values  # Target is whether the next day's price goes up (1) or down (-1)
        
        # Fit the Logistic Regression model
        model = LogisticRegression()
        model.fit(X, y)
        
        # Predict the next day's movement (up/down)
        prediction = model.predict(np.array([[i]]))  # Predict the next point (i.e., the 6th day)

        # Signal generation based on prediction (uptrend or downtrend)
        signals[i] = prediction[0]  # Buy signal if predicted 1 (up), else sell signal (-1)
    
    return signals

def strategy(data):

    # Call the logistic_regression function to get the signals
    data['signal'] = logistic_regression(data)

    return data
