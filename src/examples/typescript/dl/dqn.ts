export const deepQLearning =
    `'''
Deep Q-Learning Strategy for Stock Trading.

For every date, predict the next day's price using previous 60 days' data and take actions (buy, sell, hold) accordingly.
The agent learns and improves over time by accumulating more data and maximizing profits.
'''

import numpy as np
import pandas as pd
import random
from collections import deque
import tensorflow as tf
from tensorflow.keras import layers
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

class StockTradingEnv:
    def __init__(self, data, window_size=60):
        self.data = data
        self.window_size = window_size
        self.current_step = 0
        self.action_space = [0, 1, -1]  # 0: hold, 1: buy, -1: sell
        self.state = self.reset()
    
    def reset(self):
        self.current_step = self.window_size
        self.done = False
        self.total_profit = 0
        return self.get_state()
    
    def get_state(self):
        state = self.data.iloc[self.current_step - self.window_size:self.current_step]
        return np.array(state).flatten()
    
    def step(self, action):
        prev_state = self.state
        self.current_step += 1
        
        if self.current_step >= len(self.data) - 1:
            self.done = True
            next_state = self.get_state()
            return next_state, 0, self.done
        
        next_state = self.get_state()
        
        # Calculate reward based on action
        reward = 0
        if action == 1:  # Buy
            reward = self.data['close'][self.current_step] - self.data['close'][self.current_step - 1]
            self.total_profit += reward
        elif action == -1:  # Sell
            reward = self.data['close'][self.current_step - 1] - self.data['close'][self.current_step]
            self.total_profit += reward
        
        # Return next state, reward, done
        return next_state, reward, self.done

class DQNAgent:
    def __init__(self, state_size, action_size, alpha=0.001, gamma=0.95, epsilon=1.0, epsilon_decay=0.995, epsilon_min=0.01):
        self.state_size = state_size
        self.action_size = action_size
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = epsilon_min
        self.memory = deque(maxlen=2000)
        
        # Build the model
        self.model = self.build_model()

    def build_model(self):
        model = tf.keras.Sequential([
            layers.Dense(64, input_dim=self.state_size, activation='relu'),
            layers.Dense(64, activation='relu'),
            layers.Dense(self.action_size, activation='linear')  # Output Q-values for each action
        ])
        model.compile(loss='mse', optimizer=tf.keras.optimizers.Adam(learning_rate=self.alpha))
        return model
    
    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.choice([0, 1, -1])  # Random action (exploration)
        q_values = self.model.predict(state)
        return np.argmax(q_values[0])  # Best action (exploitation)

    def replay(self, batch_size=32):
        if len(self.memory) < batch_size:
            return
        
        minibatch = random.sample(self.memory, batch_size)
        
        for state, action, reward, next_state, done in minibatch:
            target = reward
            if not done:
                target += self.gamma * np.max(self.model.predict(next_state)[0])
            
            target_f = self.model.predict(state)
            target_f[0][action] = target
            self.model.fit(state, target_f, epochs=1, verbose=0)
        
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay


# Load data
data = pd.read_csv('your_stock_data.csv')
data = data[['close']]  # Use the 'close' price for prediction

# Normalize the data
scaler = MinMaxScaler(feature_range=(0, 1))
data_scaled = scaler.fit_transform(data)

# Initialize environment and agent
env = StockTradingEnv(data_scaled, window_size=60)
state_size = 60 * len(data.columns)
action_size = 3  # Buy, hold, sell
agent = DQNAgent(state_size=state_size, action_size=action_size)

# Train the agent
episodes = 1000
for e in range(episodes):
    state = env.reset()
    state = np.reshape(state, [1, state_size])
    total_profit = 0
    
    while True:
        action = agent.act(state)
        next_state, reward, done = env.step(action)
        next_state = np.reshape(next_state, [1, state_size])
        
        agent.remember(state, action, reward, next_state, done)
        agent.replay(batch_size=32)
        
        state = next_state
        total_profit += reward
        
        if done:
            print(f"Episode {e+1}/{episodes}, Profit: {total_profit:.2f}")
            break

# After training, you can test the agent on new data or apply it in a live environment.
`

export default deepQLearning;
