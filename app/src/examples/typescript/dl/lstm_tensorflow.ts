export const lstm_tensorflow = `'''
Long Short Term Memory in TensorFlow

A simple LSTM model that takes normalized stock price data ("open", "high", "low", "close")
and learns to predict the next day's close price. It adds a "signal" column to the data,
where 1 means the predicted price will go up, and -1 means it will go down.

Learn more @ docs.ubacktest.com/examples/deep-learning/lstmtensorflow
'''

import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

# ---- Prepare Dataset ----
def create_sequences(data, seq_length):
    x, y = [], []
    for i in range(len(data) - seq_length - 1):
        x.append(data[i:i + seq_length])
        y.append(data[i + seq_length][3])  # predict 'close' price
    return np.array(x), np.array(y)


# ---- Strategy Function Entry Point ----
def strategy(data):
    features = ['open', 'high', 'low', 'close']
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(data[features].values)

    seq_length = 60
    x, y = create_sequences(scaled, seq_length)

    # ---- Define LSTM model ----
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(seq_length, 4)),
        tf.keras.layers.LSTM(64, return_sequences=False),
        tf.keras.layers.Dense(1)
    ])

    model.compile(optimizer='adam', loss='mse')
    model.fit(x, y, epochs=10, batch_size=64, verbose=0)

    # ---- Predict and compute signals ----
    signals = [np.nan] * len(data)

    for i in range(seq_length, len(data) - 1):
        # Prepare input window
        window = scaled[i - seq_length:i].reshape(1, seq_length, 4)
        window_tensor = tf.convert_to_tensor(window, dtype=tf.float32)

        # Predict next-day scaled close
        pred_scaled = float(model(window_tensor, training=False).numpy().squeeze())

        # Inverse-transform just the close value
        predicted_close = scaler.inverse_transform([[0, 0, 0, pred_scaled]])[0, 3]

        # Compare with today's close to generate signal
        today_close = data.iloc[i]['close']
        signals[i + 1] = 1 if predicted_close > today_close else -1

    data['signal'] = signals
    return data`;
