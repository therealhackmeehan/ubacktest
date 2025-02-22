import alpaca_trade_api as trade_api
import pandas as pd
import numpy as np

# Alpaca API Credentials
api_key = "PKVO24E21E2IS6CCGSQD"
api_secret = "RTk9gCtrB0hi4yYOduSpYqwHAt2eL5QwkvLBsMTO"
base_url = "https://paper-api.alpaca.markets"

# Trading Parameters
symbol = "AAPL"
initial_capital = 10000  # Strategy capital allocated
trading_frequency = "1H"
lookback_period = 50

# Create Alpaca API Instance
api = trade_api.REST(api_key, api_secret, base_url, api_version="v2")

# Fetch OHLCV Data
def get_recent_data(symbol: str) -> pd.DataFrame:
    bars = api.get_bars(symbol, trading_frequency, limit=50).df
    bars = bars.reset_index()
    return bars[["timestamp", "open", "high", "low", "close", "volume"]]  # Keep relevant columns

# Trading endpoint
def trade():
    print(get_recent_data(symbol))
    
    # try:
    #     if is_market_open():
    #         execute_trade(symbol)
    #     else:
    #         print("Market is closed.")
    # except Exception as e:
    #     print(f"Error encountered: {e}. No trade will be placed.")

if __name__ == "__main__":
    trade()
