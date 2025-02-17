import alpaca_trade_api as trade_api
import pandas as pd

# Alpaca API Credentials
api_key = "your_api_key"
api_secret = "your_api_secret"
base_url = "https://paper-api.alpaca.markets"

# Create Alpaca API Instance
api = trade_api.REST(api_key, api_secret, base_url, api_version="v2")


# User-Defined Strategy Function
def strategy(df: pd.DataFrame) -> pd.DataFrame:
    """Example strategy: Buy if price is rising, sell if falling."""
    df["signal"] = 0  # Default: Hold
    df.loc[df["close"] > df["close"].shift(1), "signal"] = 1  # Buy if price is rising
    df.loc[df["close"] < df["close"].shift(1), "signal"] = -1  # Sell if price is falling
    return df


# Validate the Output of the User-Defined Strategy Function
def validate_strategy(df: pd.DataFrame):
    if not isinstance(df, pd.DataFrame):
        raise ValueError("Your strategy must return a DataFrame.")

    df.columns = df.columns.str.lower()
    if "signal" not in df.columns:
        raise ValueError("Missing required column: 'signal'.")

    if (df.columns == "signal").sum() > 1:
        raise ValueError("Duplicate 'signal' columns found.")

    if df["signal"].empty:
        raise ValueError("'signal' column is empty.")

    if not df.index.is_unique:
        raise ValueError("Table index must be unique.")
    
    if df.shape[0] < 3:
        raise ValueError("Not enough data to build a signal.")


# Fetch Recent OHLCV Data
def get_recent_data(symbol: str) -> pd.DataFrame:
    timeframe = "1H"
    limit = 50
    bars = api.get_bars(symbol, timeframe, limit=limit).df
    bars = bars.reset_index()  # Ensure timestamp is a column
    return bars[["timestamp", "open", "high", "low", "close", "volume"]]  # Keep relevant columns


# Main Trade Execution Logic
def execute_trade(symbol: str):
    # Fetch Latest Data and Apply Strategy
    df = get_recent_data(symbol)
    df_with_signals = strategy(df)  # Apply Trading Strategy

    validate_strategy(df_with_signals)

    # Forward-Fill Missing Signals
    df_with_signals["signal"] = df_with_signals["signal"].fillna(method="ffill").fillna(0)

    # Extract the New Trade Signal (and Compare to the Most Recent Signal)
    new_signal = df_with_signals["signal"].iloc[-1]
    last_signal = df_with_signals["signal"].iloc[-2]

    fraction_to_trade = new_signal - last_signal
    my_account = api.get_account()
    account_value = my_account.portfolio_value

    money_to_trade = account_value * fraction_to_trade

    if fraction_to_trade == 0:
        return  # No Action Needed
    elif fraction_to_trade > 0:
        order_side = "buy"
    else:
        order_side = "sell"

    # Execute Order
    api.submit_order(
        symbol=symbol,
        qty=abs(money_to_trade),  # Ensure positive quantity
        side=order_side,
        type="market",
        time_in_force="gtc",
    )


# Check If the Market Is Open
def is_market_open() -> bool:
    return api.get_clock().is_open

# Trading endpoint
def trade():
    try:
        if is_market_open():
            execute_trade("AAPL")  # Specify the trading symbol
    except Exception as e:
        print(f"Error encountered: {e}. No trade will be placed.")


if __name__ == "__main__":
    trade()
