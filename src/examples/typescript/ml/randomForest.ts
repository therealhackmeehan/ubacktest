export const randomForest = 
`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def generate_features(data):
    data['SMA_10'] = data['close'].rolling(window=10).mean()
    data['SMA_50'] = data['close'].rolling(window=50).mean()
    data['RSI'] = 100 - (100 / (1 + data['close'].pct_change().rolling(14).mean()))
    data['Volatility'] = data['close'].pct_change().rolling(10).std()
    data['Momentum'] = data['close'] - data['close'].shift(10)
    
    # Future return (Target)
    data['Future_Return'] = data['close'].pct_change(1).shift(-1)
    
    # Classification label: 1 if price increases, -1 if it decreases
    data['Target'] = np.where(data['Future_Return'] > 0, 1, -1)
    
    return data.dropna()

# Load and preprocess data
data = pd.read_csv("your_stock_data.csv")
data = generate_features(data)

# Select features & target
features = ['SMA_10', 'SMA_50', 'RSI', 'Volatility', 'Momentum']
X = data[features]
y = data['Target']

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# Train the Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Test Accuracy
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")

def strategy(data, model):
    data = generate_features(data)
    
    # Get model predictions
    data['signal'] = model.predict(data[['SMA_10', 'SMA_50', 'RSI', 'Volatility', 'Momentum']])
    
    # Forward fill to maintain positions
    data['signal'] = data['signal'].ffill().fillna(0)

    return data`