export const alpacaCode = (strategyFcn: string, symbol: string, lookback: number, tradingfrequency: string): string => {

    return `import alpaca_trade_api as trade_api
import pandas as pd

# -------------------------------
# Alpaca API Credentials
# -------------------------------
api_key = "PUT_YOUR_API_KEY_HERE"
api_secret = "PUT_YOUR_API_SECRET_HERE"
base_url = "https://paper-api.alpaca.markets" # Default is Paper Money
# base_url = "https:/api.alpaca.markets" # Toggle to Real Money at your Own Risk

# -------------------------------
# Trading Parameters
# -------------------------------
symbol = "${symbol}"  # Stock ticker symbol
trading_frequency = "${tradingfrequency}"  # E.g., "1D" for daily data
lookback_period = ${lookback}  # Number of past bars to analyze

# Create an Alpaca API instance
api = trade_api.REST(api_key, api_secret, base_url, api_version="v2")

# -------------------------------
# USER-DEFINED STRATEGY FUNCTION
# -------------------------------
${strategyFcn}

# -------------------------------
# Fetch OHLCV Data
# -------------------------------
def get_recent_data(symbol: str) -> pd.DataFrame:
    """
    Retrieves recent OHLCV (Open, High, Low, Close, Volume) data for the given symbol.
    """
    bars = api.get_bars(symbol, trading_frequency, limit=lookback_period).df
    bars = bars.reset_index()  # Reset index for easier manipulation
    return bars[["timestamp", "open", "high", "low", "close", "volume"]]  # Keep relevant columns

# -------------------------------
# Get Strategy's Current Position
# -------------------------------
def get_strategy_position(symbol: str) -> int:
    """
    Retrieves the number of shares currently held in the strategy.
    Returns positive for long positions, negative for short positions, and 0 if no position.
    """
    try:
        position = api.get_position(symbol)
        return int(position.qty)  # Convert quantity to an integer
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
    """
    df = get_recent_data(symbol)  # Fetch recent market data
    df_with_signals = strategy(df)  # Apply strategy to generate signals
    validate_strategy(df_with_signals)  # Ensure strategy output is valid

    # Fill missing signals with the previous value, and replace NaNs with 0
    df_with_signals['signal'] = df_with_signals['signal'].ffill().fillna(0)

    # Extract the last two signals
    new_signal = df_with_signals["signal"].iloc[-1]
    last_signal = df_with_signals["signal"].iloc[-2]
    to_trade_now = new_signal - last_signal  # Compute trade requirement

    if new_signal == last_signal:
        return  # No trade needed

    # Get account details
    account = api.get_account()
    total_cash = float(account.cash)  # Available cash for trading

    # Get the latest stock price
    last_trade = api.get_latest_trade(symbol)
    stock_price = float(last_trade.p)

    # Determine the target number of shares to hold based on the new signal
    target_position_value = to_trade_now * total_cash
    target_shares = target_position_value / stock_price

    # Get the number of shares currently held
    current_shares = get_strategy_position(symbol)

    # Compute the number of shares to buy/sell
    shares_to_trade = target_shares - current_shares

    # Ignore small trades and return if no trade is required
    if abs(shares_to_trade) < 1:
        return

    # Determine buy or sell action
    order_side = "buy" if shares_to_trade > 0 else "sell"

    print(f"Placing {order_side} order for {abs(shares_to_trade)} shares of {symbol}")

    # Submit order to Alpaca
    api.submit_order(
        symbol=symbol,
        qty=abs(shares_to_trade),  # Must be an integer
        side=order_side,
        type="market",
        time_in_force="gtc",  # Good till canceled
    )

    print(f"Successfully placed {order_side} order for {abs(shares_to_trade)} shares of {symbol}")

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
    try:
        if is_market_open():
            execute_trade(symbol)
        else:
            print("Market is closed. No trade will be placed.")
    except Exception as e:
        print(f"Error encountered: {e}. No trade will be placed.")

# Run the trading function
if __name__ == "__main__":
    trade()`;
}
