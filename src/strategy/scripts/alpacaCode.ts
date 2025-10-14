export const alpacaCode = (
  strategyFcn: string,
  symbol: string,
  lookback: number,
  amount: string,
  timeUnit: string,
): string => {
  return `"""
Alpaca Trading Script
----------------------
This script fetches historical stock data, applies a basic trading strategy, 
and executes market orders based on the strategy's signals.

Key Features:
- Fetches historical stock data from Alpaca
- Implements a simple buy-and-hold strategy
- Manages trades and portfolio positions dynamically
- Logs key actions for easier debugging and tracking

Requirements:
- An Alpaca API account with the necessary API keys
- The \`alpaca-trade-api\` and \`pandas\` libraries, at a minumum
"""

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest, StockQuotesRequest
from alpaca.data.timeframe import TimeFrame, TimeFrameUnit

import pandas as pd
import math
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

# ---------------------------------
# Configuration & API Credentials
# ---------------------------------
API_KEY = <place_your_key_here!>        # EDIT THIS LINE!
API_SECRET = <place_your_secret_here!>  # EDIT THIS LINE!

SYMBOL = "${symbol}"  # Stock symbol to trade
TIMEPOINTS = ${lookback}  # Number of historical data points to fetch
TRADING_FREQUENCY = ${timeUnit}  # Trading frequency (e.g., minutes, hours, days)

# Alpaca API Clients
trading_client = TradingClient(API_KEY, API_SECRET, paper=True)  # Paper trading client
historical_client = StockHistoricalDataClient(API_KEY, API_SECRET)  # Historical data client

# ---------------------------------
# Utility Functions
# ---------------------------------

def log(message, level="INFO"):
    """
    Logs messages with a timestamp for debugging and tracking.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

# ---------------------------------
# Trading Strategy
# ---------------------------------

${strategyFcn}

# ---------------------------------
# Data Retrieval Functions
# ---------------------------------

def get_historical_data(symbol: str) -> pd.DataFrame:
    """
    Fetches historical market data for the given stock symbol.
    
    Parameters:
    - symbol (str): Stock symbol to retrieve data for
    
    Returns:
    - pd.DataFrame: Historical stock data
    """
    now = datetime.now(ZoneInfo("America/New_York"))
    log(f"Fetching historical data for {symbol}...")

    request_params = StockBarsRequest(
        symbol_or_symbols=[symbol],
        timeframe=TimeFrame(amount=${amount}, unit=TRADING_FREQUENCY),
        start=now - timedelta(days=365),
        limit=TIMEPOINTS,
    )
    
    bars = historical_client.get_stock_bars(request_params).df
    bars = bars.reset_index()
    
    log(f"Retrieved {len(bars)} bars for {symbol}.")
    return bars[["timestamp", "open", "high", "low", "close", "volume"]]  # Keep relevant columns

def get_position_value(symbol: str) -> float:
    """
    Retrieves the current market value of an open position.
    
    Parameters:
    - symbol (str): Stock symbol to check position for
    
    Returns:
    - float: Market value of the position, or 0 if no position exists
    """
    try:
        position = trading_client.get_open_position(symbol)
        value = float(position.market_value)
        log(f"Current position in {symbol}: \${value:.2f}")
        return value
    except Exception:
        log(f"No open position found for {symbol}.", level="WARNING")
        return 0  # No position found

# ---------------------------------
# Trade Execution Functions
# ---------------------------------

def execute_trade(symbol: str):
    """
    Executes a trade based on the latest strategy signal.
    
    Parameters:
    - symbol (str): Stock symbol to trade
    """
    log(f"Executing trade for {symbol}...")

    # Fetch historical data and apply strategy
    historical_data = get_historical_data(symbol)
    df = strategy(historical_data)
    
    df["signal"] = df["signal"].ffill().fillna(0)  # Ensure signal is always defined

    new_signal = df["signal"].iloc[-1]
    prev_signal = df["signal"].iloc[-2]
    log(f"New signal: {new_signal}, Previous signal: {prev_signal}")

    if new_signal == prev_signal:
        log("No change in signal. Skipping trade.", level="INFO")
        return
    
    current_equity = get_position_value(symbol)
    
    # Closing position if new signal is zero
    if current_equity != 0 and new_signal == 0:
        log(f"Signal is 0. Closing position in {symbol}.")
        trading_client.close_position(symbol)
        return

    # Calculate target equity and required movement
    portfolio_value = float(trading_client.get_account().portfolio_value)
    target_equity = portfolio_value * new_signal
    money_to_move = current_equity - target_equity
    log(f"Portfolio Value: \${portfolio_value:.2f}, Target Equity: \${target_equity:.2f}, Money to Move: \${money_to_move:.2f}")

    # If switching from long to short or vice versa, close existing position first
    if (current_equity > 0 and target_equity < 0) or (current_equity < 0 and target_equity > 0):
        log(f"Switching from long to short (or vice versa), closing existing position in {symbol}.")
        trading_client.close_position(symbol)
        money_to_move += current_equity
        log(f"Money to Move (updated): \${money_to_move:.2f}")

    if money_to_move > 0:
        log(f"Placing BUY order for \${abs(money_to_move):.2f} of {symbol}.")
        order_details = MarketOrderRequest(
            symbol=symbol,
            notional=abs(money_to_move), 
            side=OrderSide.BUY, 
            time_in_force=TimeInForce.DAY
        )
    elif money_to_move < 0:
        log(f"Placing SELL order for \${abs(money_to_move):.2f} of {symbol}.")
        latest_bar_details = StockQuotesRequest(symbol_or_symbols=[symbol])
        latest_price = historical_client.get_stock_latest_bar(latest_bar_details).close

        order_details = MarketOrderRequest(
            symbol=symbol, 
            qty=math.floor(abs(money_to_move) / latest_price), 
            side=OrderSide.SELL, 
            time_in_force=TimeInForce.DAY
        )
    else:
        log("No trade needed.", level="INFO")
        return

    try:
        trading_client.submit_order(order_details)
        log("Order submitted successfully.", level="SUCCESS")
    except Exception as e:
        log(f"Failed to submit order: {e}", level="ERROR")

# ---------------------------------
# Main Trading Execution
# ---------------------------------

def trade():
    """
    Checks market status and executes a trade if the market is open.
    """
    try:
        log("Checking market status...")

        symbol = SYMBOL.upper()
        asset = trading_client.get_asset(symbol)
        if not asset.tradable or not asset.fractionable:
            log(f"{SYMBOL} is not tradable or fractionable.", level="ERROR")
            return
        
        if trading_client.get_clock().is_open:
            log("Market is OPEN. Executing trade.")
            execute_trade(SYMBOL)
        else:
            log("Market is CLOSED. No trade will be placed.", level="WARNING")
    except Exception as e:
        log(f"Error encountered: {e}. No trade will be placed.", level="ERROR")

# ---------------------------------
# Entry Point
# ---------------------------------

if __name__ == "__main__":
    trade()
`;
};
