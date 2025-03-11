const svmClassifier = `
'''
Support Vector Machine (SVM) Classifier.

Built on the previous 30 days, using multiple features to predict the next day's movement (up/down).
'''

import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

def create_features(data, window=30):
    """
    Create features for SVM model, including closing price, volume, and SMA.
    """
    data['SMA_30'] = data['close'].rolling(window=window).mean()  # Simple Moving Average
    data['volume_30'] = data['volume'].rolling(window=window).mean()  # 30-day moving average of volume

    # Features: previous 'window' days of closing prices and other indicators
    data['close_lag'] = data['close'].shift(1)
    data['volume_lag'] = data['volume'].shift(1)

    # Remove missing values that may have been created by the rolling windows
    data = data.dropna()

    return data

def svm_classifier(data, window=30, kernel='linear'):
    """
    Function to implement SVM Classifier strategy for time series data (e.g., stock closing prices).
    """
    # Create features
    data = create_features(data, window)
    
    # Create target variable: 1 if the next day's price is higher, 0 if it is lower
    data['target'] = (data['close'].shift(-1) > data['close']).astype(int)

    # Features for the model: closing price, volume, and simple moving average (SMA)
    features = ['close', 'volume', 'SMA_30', 'close_lag', 'volume_lag']
    
    X = data[features]  # Input features
    y = data['target']  # Target variable

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the SVM classifier
    model = SVC(kernel=kernel)  # You can use 'linear', 'poly', 'rbf', etc.
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    # Generate the signals based on predictions
    data['signal'] = model.predict(X)
    
    return data

def strategy(data, window=30, kernel='linear'):
    """
    Implements a trading strategy that uses Support Vector Machine Classifier for signals.
    """
    # Call the svm_classifier function to get the signals
    data = svm_classifier(data, window, kernel)

    return data
`;

export default svmClassifier;
