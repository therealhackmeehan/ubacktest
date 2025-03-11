export const lstm = `'''
LSTM Model for Stock Price Prediction.

For every date, use the previous 60 days' data to predict the 61st day's closing price.
Iteratively predict future days by using the most recent prediction as part of the input for the next day's prediction.
'''

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt

def prepare_data(data, window=60):
    """
    Prepare the data for the LSTM model.
    Create X (features) and y (target) based on the past 'window' days.
    """

    X, y = [], []
    
    for i in range(window, len(data)):
        X.append(data[i-window:i, 0])  # Taking the past window days (e.g., 60 days of closing prices)
        y.append(data[i, 0])  # The target is the next day's closing price
    
    return np.array(X), np.array(y)

def build_lstm_model(input_shape):
    """
    Build and compile the LSTM model.
    """

    model = Sequential()
    model.add(LSTM(units=50, return_sequences=False, input_shape=input_shape))
    model.add(Dense(units=1))  # Output layer: single prediction for the next day's closing price
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
    return model

def iterative_prediction(data, model, window=60, num_predictions=30):
    """
    Generate predictions iteratively using the model.
    Start with the last window days, and use predictions as part of the input for the next prediction.
    """

    predictions = []
    
    # Prepare the initial input (last window days of data)
    current_input = data[-window:]
    
    for _ in range(num_predictions):
        # Reshape the input to the shape (1, window, 1) for the LSTM model
        current_input = current_input.reshape((1, window, 1))
        
        # Predict the next day's closing price
        prediction = model.predict(current_input)
        predictions.append(prediction[0, 0])
        
        # Update the current_input to include the prediction as the next day's data
        current_input = np.append(current_input[:, 1:, :], prediction.reshape(1, 1, 1), axis=1)
    
    return predictions

def strategy(data, window=60, num_predictions=30):
    """
    Implements a trading strategy using the LSTM model to predict future stock prices.
    The model uses the previous 60 days' data to predict the 61st day's closing price.
    """

    # Load and preprocess the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_scaled = scaler.fit_transform(data[['close']].values)

    # Prepare the dataset
    X, y = prepare_data(data_scaled, window)

    # Reshape the data for LSTM input (samples, time steps, features)
    X = X.reshape(X.shape[0], X.shape[1], 1)

    # Split data into training and test sets (80% train, 20% test)
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    # Build and train the LSTM model
    model = build_lstm_model((X_train.shape[1], 1))
    model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_test, y_test))

    # Predict iteratively for the next 30 days (or however many days you want to predict)
    predictions = iterative_prediction(data_scaled, model, window, num_predictions)

    # Inverse the scaling of predictions to get back to the original price range
    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))

    # Plot the predictions against the actual data
    plt.plot(data.index[-window:], data['close'].values[-window:], label='Last 60 days of actual data')
    plt.plot(range(len(data), len(data) + num_predictions), predictions, label='Predicted prices for next 30 days', color='red')
    plt.title('Stock Price Prediction (Iterative LSTM)')
    plt.legend()
    plt.show()

    # Print the predictions
    print(f"Predictions for the next {num_predictions} days:")
    print(predictions.flatten())

    # Assign signals (1 for buying, -1 for holding, here just showing example of buy/sell)
    data['signal'] = 1  # In a real strategy, this would be based on predicted direction or other criteria

    return data
`