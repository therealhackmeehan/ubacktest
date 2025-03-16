
'''
Deep Learning (LSTM) Classifier.

Built on the previous 30 days, using multiple features to predict the next day's movement (up/down).
'''

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import StandardScaler

def create_features(data, indicator_window=14):
    """
    Create features for the LSTM model, including closing price, volume, and SMA.
    """
    data[f'SMA_{indicator_window}'] = data['close'].rolling(window=indicator_window).mean()  # Simple Moving Average
    data[f'volume_{indicator_window}'] = data['volume'].rolling(window=indicator_window).mean()  # 30-day moving average of volume

    return data

def build_lstm_model(input_shape):
    """
    Build an LSTM model for stock prediction.
    """
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(25, activation='relu'),
        Dense(1, activation='tanh')  # Output is between -1 and 1
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['accuracy'])
    return model

def deep_learning_classifier(data, training_window=30, indicator_window=14, epochs=20, batch_size=16):
    """
    Implements an LSTM-based Deep Learning Classifier with a sliding window approach.
    """

    # Create features
    data = create_features(data, indicator_window)

    # Create the target variable: 1 if the next day's price is higher, -1 if it is lower
    data['target'] = (data['close'].shift(-1) > data['close']).astype(int) * 2 - 1

    features = ['close', 'volume', f'SMA_{indicator_window}', f'volume_{indicator_window}']
    
    scaler = StandardScaler()  # Standardize features for better neural network performance
    predictions = []

    for i in range(training_window+indicator_window, len(data)):
        train_data = data.iloc[i-training_window:i]  # Rolling window for training
        test_data = data.iloc[[i]]  # Single test point (next day)

        X_train, y_train = train_data[features], train_data['target']
        X_test = test_data[features]

        # Scale the data
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Reshape for LSTM (samples, time steps, features)
        X_train_reshaped = np.reshape(X_train_scaled, (X_train_scaled.shape[0], 1, X_train_scaled.shape[1]))
        X_test_reshaped = np.reshape(X_test_scaled, (X_test_scaled.shape[0], 1, X_test_scaled.shape[1]))

        # Build and train the LSTM model
        model = build_lstm_model((1, X_train_scaled.shape[1]))
        model.fit(X_train_reshaped, y_train, epochs=epochs, batch_size=batch_size, verbose=0)

        # Make prediction
        pred = model.predict(X_test_reshaped)[0][0]
        predictions.append(1 if pred > 0 else -1)  # Convert output to -1 or 1

    # Assign predictions back to the data
    data.loc[data.index[training_window+indicator_window:], 'signal'] = predictions

    return data

def strategy(data):
    """
    Implements a trading strategy using the LSTM-based Deep Learning Classifier.
    """
    
    # Call the deep_learning_classifier function to get signals
    data = deep_learning_classifier(data)

    return data