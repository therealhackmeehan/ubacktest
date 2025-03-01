import alpaca_trade_api as trade_api
import pandas as pd
import math

# -------------------------------
# Alpaca API Credentials
# -------------------------------

base_url = "https://paper-api.alpaca.markets" # Default is Paper Money
# base_url = "https:/api.alpaca.markets" # Toggle to Real Money at your Own Risk

# -------------------------------
# Trading Parameters
# -------------------------------
symbol = "AAPL"  # Stock ticker symbol
trading_frequency = "1Day"  # E.g., "1D" for daily data
lookback_period = 50  # Number of past bars to analyze

# Create an Alpaca API instance
api = trade_api.REST(api_key, api_secret, base_url, api_version="v2")

# -------------------------------
# USER-DEFINED STRATEGY FUNCTION
# -------------------------------
def calculate_bollinger_bands(series, window=20, num_std=2):
    sma = series.rolling(window=window).mean()
    std = series.rolling(window=window).std()
    
    upper_band = sma + (std * num_std)
    lower_band = sma - (std * num_std)

    return upper_band, lower_band

def strategy(data):
    data['Upper_Band'], data['Lower_Band'] = calculate_bollinger_bands(data['close'], window=20)

    # Generate signals
    data['signal'] = data.apply(
        lambda row: 1 if row['close'] <= row['Lower_Band'] 
        else -1 if row['close'] >= row['Upper_Band'] 
        else 0, axis=1
    )

    return data

# -------------------------------
# Fetch OHLCV Data
# -------------------------------
def get_recent_data(symbol: str) -> pd.DataFrame:
    """
    Retrieves recent OHLCV (Open, High, Low, Close, Volume) data for the given symbol.
    """
    bars = api.get_bars(symbol, timeframe=trade_api.TimeFrame.Minute, limit=100).df
    bars = bars.reset_index()  # Reset index for easier manipulation
    return bars[["timestamp", "open", "high", "low", "close", "volume"]]  # Keep relevant columns

# -------------------------------
# Get Strategy's Current Position
# -------------------------------
def get_position_value(symbol: str) -> float:
    """
    Retrieves the number of shares currently held in the strategy.
    Returns positive for long positions, negative for short positions, and 0 if no position.
    """
    try:
        position = api.get_position(symbol)

        mkt_value = float(position.market_value)
        side = position.side
        if side == "short":
            mkt_value *= -1

        return mkt_value
    except Exception:
        return 0  # No position found

# -------------------------------
# Validate Strategy Output
# -------------------------------
def validate_strategy(df: pd.DataFrame):
    """
    Ensures that the strategy function returns a properly formatted DataFrame.
    """
    if not isinstance(df, pd.DataFrame):
        raise ValueError("Your strategy must return a DataFrame.")

    df.columns = df.columns.str.lower()  # Normalize column names
    if "signal" not in df.columns:
        raise ValueError("Missing required column: 'signal'.")

    if (df.columns == "signal").sum() > 1:
        raise ValueError("Duplicate 'signal' columns found.")

    if df["signal"].empty:
        raise ValueError("'signal' column is empty.")

    if (df['signal'] > 1).any() or (df['signal'] < -1).any():
        raise Exception("'signal' column contains values outside the range [-1, 1].")

    if not df.index.is_unique:
        raise ValueError("Table index must be unique.")

    if df.shape[0] < 3:
        raise ValueError("Not enough data to build a signal.")

# -------------------------------
# Execute Trade
# -------------------------------
def execute_trade(symbol: str):
    """
    Executes a trade based on the latest signal from the strategy.
    Ensures portfolio-relative allocation while preventing margin usage.
    """

    # Fetch recent market data and apply the trading strategy
    df = get_recent_data(symbol)
    df_with_signals = strategy(df)
    
    # Validate strategy output
    validate_strategy(df_with_signals)

    # Forward-fill missing signals and replace NaNs with 0
    df_with_signals['signal'] = df_with_signals['signal'].ffill().fillna(0)

    # Extract the latest trading signal
    new_signal = df_with_signals["signal"].iloc[-1]
    last_signal = df_with_signals["signal"].iloc[-2]

    new_signal = -.2
    print(f"Latest signal: {new_signal}")

    # Avoid making any trades if the signal persists
    if new_signal == last_signal:
        print("No trade placed. No change from previous allocation.")
        return
    
    current_shares_value = get_position_value(symbol)

    if current_shares_value != 0 and new_signal == 0:
        print(f"Closing position for {symbol}")
        api.close_position(symbol)
        return

    # Get account details
    account = api.get_account()
    portfolio_value = account.portolio_value()

    # Determine target stock value and shares based on new signal
    target_allocation = (new_signal * portfolio_value)

    # Calculate the number of shares to trade
    money_to_trade = current_shares_value - target_allocation

    # If moving from buy->short or vice versa, close the position prior
    if (target_allocation > 0 and current_shares_value < 0) or (target_allocation < 0 and current_shares_value > 0):
        print(f"Closing position ({current_shares_value} shares) before switching sides in {symbol}")
        api.close_position(symbol)

        # Recalculate shares_to_trade since closing brings position to zero
        money_to_trade += current_shares_value

    # Determine trade direction (buy/sell)
    if money_to_trade > 0:
        order_side = "buy"

    elif money_to_trade < 0:
        order_side = "sell"

        # Alpaca does not support fractional share short selling
        # shares_to_trade = math.floor(shares_to_trade)
    else:
        return  # No trade needed. Should have already returned regardless.

    print(f"Placing {order_side} order for {abs(money_to_trade)} dollars of {symbol}")

    # Submit market order to Alpaca
    api.submit_order(
        symbol=symbol,
        notational=abs(money_to_trade),
        side=order_side,
        type="market",
        time_in_force="day", # must be day (for fractional shares)
    )

    print(f"Successfully placed {order_side} order for {abs(money_to_trade)} dollars of {symbol}")

# -------------------------------
# Check If Market Is Open
# -------------------------------
def is_market_open() -> bool:
    """
    Checks if the market is currently open.
    """
    return api.get_clock().is_open

# -------------------------------
# Main Trading Function
# -------------------------------
def trade():
    """
    Entry point for executing trades. It first checks if the market is open before executing a trade.
    """
    asset = api.get_asset(symbol)
    if not asset.tradable:
        print(f"{symbol} is not tradable at this time")
        return
    
    try:
        # if is_market_open():
            execute_trade(symbol)
        # else:
            print("Market is closed. No trade will be placed.")
    except Exception as e:
        print(f"Error encountered: {e}. No trade will be placed.")

# Run the trading function
if __name__ == "__main__":
    trade()
