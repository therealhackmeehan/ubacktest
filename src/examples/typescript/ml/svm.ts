const svmClassifier = `
'''
Support Vector Machine (SVM) Classifier.

Built on the previous 30 days, using multiple features to predict the next day's movement (up/down).
'''

import pandas as pd
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler

def create_features(data, indicator_window=14):
    """
    Create features for SVM model, including closing price, volume, and SMA.
    """
    data[f'SMA_{window}'] = data['close'].rolling(window=window).mean()  # Simple Moving Average
    data[f'volume_{window}'] = data['volume'].rolling(window=window).mean()  # 30-day moving average of volume

    return data

def svm_classifier(data, training_window=30, indicator_window=14, kernel='linear'):
    """
    Implements an SVM Classifier with a sliding window approach.
    """

    # Create features
    data = create_features(data, indicator_window)

    # Create the target variable: 1 if the next day's price is higher, -1 if it is lower
    data['target'] = (data['close'].shift(-1) > data['close']).astype(int) * 2 - 1

    features = ['close', 'volume', f'SMA_{indicator_window}', f'volume_{feature_window}]
    
    scaler = StandardScaler()  # Standardize features for better SVM performance
    predictions = []

    for i in range(training_window+indicator_window, len(data)):
        train_data = data.iloc[i-training_window:i]  # Rolling window for training
        test_data = data.iloc[[i]]  # Single test point (next day)

        X_train, y_train = train_data[features], train_data['target']
        X_test = test_data[features]

        # Scale the data
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Train the model
        model = SVC(kernel=kernel)
        model.fit(X_train_scaled, y_train)

        # Make prediction
        pred = model.predict(X_test_scaled)[0]
        predictions.append(pred)

    # Assign predictions back to the data
    data.loc[data.index[training_window+indicator_window:], 'signal'] = predictions

    return data

def strategy(data):
    """
    Implements a trading strategy using the Support Vector Machine Classifier.
    """
    
    # Call the svm_classifier function to get signals
    data = svm_classifier(data)

    return data`;

export default svmClassifier;
