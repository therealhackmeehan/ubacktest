'''
Support Vector Machine (SVM) Classifier.

Trains a SVC using the past 30 days of data to predict the next day's action. 
The model leverages basic technical indicators as features to make predictions.
Learn more @ docs.ubacktest.com/examples/machine-learning/svmclassifier
'''

import pandas as pd
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler

def create_features(data, indicator_window=14):

    data[f'SMA_{indicator_window}'] = data['close'].rolling(window=indicator_window).mean()
    data[f'volume_{indicator_window}'] = data['volume'].rolling(window=indicator_window).mean()
    delta = data['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=indicator_window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=indicator_window).mean()
    data[f'RSI_{indicator_window}'] = 100 - (100 / (1 + gain / loss))
    data[f'EMA_{indicator_window}'] = data['close'].ewm(span=indicator_window, adjust=False).mean()
    data['EMA_12'] = data['close'].ewm(span=12, adjust=False).mean()
    data['EMA_26'] = data['close'].ewm(span=26, adjust=False).mean()
    data['MACD'] = data['EMA_12'] - data['EMA_26']
    data['MACD_signal'] = data['MACD'].ewm(span=9, adjust=False).mean()  # Signal line for MACD
    data['bollinger_upper'] = data[f'SMA_{indicator_window}'] + (data['close'].rolling(window=indicator_window).std() * 2)
    data['bollinger_lower'] = data[f'SMA_{indicator_window}'] - (data['close'].rolling(window=indicator_window).std() * 2)
    
    return data

def svm_classifier(data, training_window=30, indicator_window=14, kernel='linear'):

    # Create features
    data = create_features(data, indicator_window)

    # Create the target variable: 1 if the next day's price is higher, -1 if it is lower
    data['target'] = (data['close'].shift(-1) > data['close']).astype(int) * 2 - 1

    features = [
        'close', 
        'volume', 
        f'SMA_{indicator_window}', 
        f'volume_{indicator_window}', 
        f'RSI_{indicator_window}', 
        f'EMA_{indicator_window}', 
        'MACD', 
        'MACD_signal', 
        'bollinger_upper', 
        'bollinger_lower', 
    ]
            
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
    
    # Call the svm_classifier function to get signals
    data = svm_classifier(data)

    return data