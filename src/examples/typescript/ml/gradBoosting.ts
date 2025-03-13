const gradientBoostingClassifier = `
'''
Gradient Boosting Classifier.

Built on the previous 30 days, using multiple features to predict the next day's movement (up/down).
'''

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler

def create_features(data, indicator_window=14):
    """
    Create features for Gradient Boosting model, including closing price, volume, and SMA.
    """
    data[f'SMA_{indicator_window}'] = data['close'].rolling(window=indicator_window).mean()  # Simple Moving Average
    data[f'volume_{indicator_window}'] = data['volume'].rolling(window=indicator_window).mean()  # 30-day moving average of volume

    return data

def gradient_boosting_classifier(data, training_window=30, indicator_window=14, n_estimators=100, learning_rate=0.1, max_depth=3):
    """
    Implements a Gradient Boosting Classifier with a sliding window approach.
    """

    # Create features
    data = create_features(data, indicator_window)

    # Create the target variable: 1 if the next day's price is higher, -1 if it is lower
    data['target'] = (data['close'].shift(-1) > data['close']).astype(int) * 2 - 1

    features = ['close', 'volume', f'SMA_{indicator_window}', f'volume_{indicator_window}']
    
    scaler = StandardScaler()  # Standardize features for better Gradient Boosting performance
    predictions = []

    for i in range(training_window+indicator_window, len(data)):
        train_data = data.iloc[i-training_window:i]  # Rolling window for training
        test_data = data.iloc[[i]]  # Single test point (next day)

        X_train, y_train = train_data[features], train_data['target']
        X_test = test_data[features]

        # Scale the data
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Train the Gradient Boosting model
        model = GradientBoostingClassifier(n_estimators=n_estimators, learning_rate=learning_rate, max_depth=max_depth, random_state=42)
        model.fit(X_train_scaled, y_train)

        # Make prediction
        pred = model.predict(X_test_scaled)[0]
        predictions.append(pred)

    # Assign predictions back to the data
    data.loc[data.index[training_window+indicator_window:], 'signal'] = predictions

    return data

def strategy(data):
    """
    Implements a trading strategy using the Gradient Boosting Classifier.
    """
    
    # Call the gradient_boosting_classifier function to get signals
    data = gradient_boosting_classifier(data)

    return data`;

export default gradientBoostingClassifier;
