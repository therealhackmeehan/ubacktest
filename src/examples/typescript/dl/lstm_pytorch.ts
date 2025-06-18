export const lstm_pytorch =
    `'''
Long Short Term Memory in PyTorch

A simple LSTM model that takes normalized stock price data ("open", "high", "low", "close")
and learns to predict the next day's close price. It adds a "signal" column to the data,
where 1 means the predicted price will go up, and -1 means it will go down.

Learn more @ docs.ubacktest.com/examples/deep-learning/lstmpytorch
'''

import pandas as pd
import numpy as np
import torch
from torch import nn
from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import Dataset, DataLoader


# ---- LSTM Model ----
class LSTMModel(nn.Module):
    def __init__(self, input_size=4, hidden_size=64, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = out[:, -1, :]  # take last time step
        return self.fc(out)


# ---- Dataset Loader ----
class StockDataset(Dataset):
    def __init__(self, data, seq_length=60):
        self.seq_length = seq_length
        self.x = []
        self.y = []

        for i in range(len(data) - seq_length - 1):
            seq_x = data[i:i+seq_length]
            seq_y = data[i+seq_length][3]  # 3 = index of 'close'
            self.x.append(seq_x)
            self.y.append(seq_y)

    def __len__(self):
        return len(self.x)

    def __getitem__(self, idx):
        return (
            torch.tensor(self.x[idx], dtype=torch.float32),
            torch.tensor(self.y[idx], dtype=torch.float32)
        )


# ---- Strategy Function Entry Point ----
def strategy(data):
    # Normalize all features: open, high, low, close
    scaler = MinMaxScaler()
    features = ['open', 'high', 'low', 'close']
    scaled = scaler.fit_transform(data[features].values)

    # Create dataset and dataloader
    seq_length = 60
    dataset = StockDataset(scaled, seq_length)
    dataloader = DataLoader(dataset, batch_size=64, shuffle=True)

    # Initialize model
    model = LSTMModel(input_size=4)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()

    # Train model
    model.train()
    for epoch in range(10):
        for x_batch, y_batch in dataloader:
            output = model(x_batch).squeeze()
            loss = criterion(output, y_batch)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

    # Make predictions across the whole dataset
    model.eval()
    signals = [None] * len(data)  # default None for first seq_length rows

    with torch.no_grad():
        for i in range(seq_length, len(data) - 1):
            seq_input = scaled[i - seq_length:i]
            seq_tensor = torch.tensor(seq_input, dtype=torch.float32).unsqueeze(0)  # shape (1, seq_len, input_size)
            predicted_scaled = model(seq_tensor).item()
            
            # Inverse transform to get actual price
            predicted_close = scaler.inverse_transform([[0, 0, 0, predicted_scaled]])[0][3]
            today_close = data.iloc[i]['close']
            signal = 1 if predicted_close > today_close else -1
            signals[i + 1] = signal  # signal for next day

    data['signal'] = signals
    return data`;