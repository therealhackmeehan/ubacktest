"""
Alpaca Trading Script
----------------------
This script fetches historical stock data, applies a basic trading strategy, 
and executes market orders based on the strategy's signals.

Key Features:
- Fetches historical stock data from Alpaca
- Implements a custom strategy
- Manages trades and portfolio positions dynamically
- Logs key actions for easier debugging and tracking

Requirements:
- An Alpaca API account with the necessary API keys
- The `alpaca-py` and `pandas` libraries installed
"""

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest, StockQuotesRequest
from alpaca.data.timeframe import TimeFrame, TimeFrameUnit

import pandas as pd
import math
import time
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import os
import functions_framework # Needed to interact with Google Cloud Run

# ---------------------------------
# Configuration & API Credentials
# ---------------------------------
API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")

SYMBOL = "F"  # Stock symbol to trade
TIMEPOINTS = 100  # Number of historical data points to fetch
TRADING_FREQUENCY = TimeFrameUnit.Minute  # Trading frequency (e.g., minutes, hours, days)

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
    print(f"FROM uBacktest: [{level}] {message}")

# ---------------------------------
# Trading Strategy
# ---------------------------------

'''
Simple Moving Average Crossover Strategy

Generates buy/short signals based on two SMAs.
'''

def strategy(data, short_window=10, long_window=50):
    data['SMA_short'] = data['close'].rolling(window=short_window).mean()
    data['SMA_long'] = data['close'].rolling(window=long_window).mean()

    data['signal'] = 0  # Default to hold
    data.loc[data['SMA_short'] > data['SMA_long'], 'signal'] = 1  # Buy
    data.loc[data['SMA_short'] < data['SMA_long'], 'signal'] = -1  # Short

    return data

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
        timeframe=TimeFrame(amount=1, unit=TRADING_FREQUENCY),
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
        log(f"Current position in {symbol}: ${value:.2f}")
        return value
    except Exception:
        log(f"No open position found for {symbol}.")
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
    money_to_move = target_equity - current_equity
    log(f"Portfolio Value: ${portfolio_value:.2f}, Target Equity: ${target_equity:.2f}, Money to Move: ${money_to_move:.2f}")

    # If switching from long to short or vice versa, close existing position first
    if (current_equity > 0 and target_equity < 0) or (current_equity < 0 and target_equity > 0):
        log(f"Switching from long to short (or vice versa), closing existing position in {symbol}.")
        trading_client.close_position(symbol)
        while True:
            log("Validating the position has gone to 0...")
            try:
                pos = get_position_value(symbol)
                if pos == 0:
                    log("Position successfully @ 0.")
                    break
            except:
                break
            time.sleep(.5)  # Small delay            

        money_to_move += current_equity
        log(f"Money to Move (updated): ${money_to_move:.2f}")

    if money_to_move > 0:
        log(f"Placing BUY order for ${abs(money_to_move):.2f} of {symbol}.")
        order_details = MarketOrderRequest(
            symbol=symbol,
            notional=abs(math.floor(money_to_move * 100)/100), 
            side=OrderSide.BUY, 
            time_in_force=TimeInForce.DAY
        )
    elif money_to_move < 0:
        log(f"Placing SELL order for ${abs(money_to_move):.2f} of {symbol}.")

        latest_bar_details = StockQuotesRequest(symbol_or_symbols=symbol)
        latest_price = float(historical_client.get_stock_latest_bar(latest_bar_details)[symbol].close)
        shares_to_sell = math.floor(abs(money_to_move)/latest_price)
        shares_to_sell_value = shares_to_sell*latest_price

        if shares_to_sell == 0:
            log("SELL order requires 0 shares be sold. No trade will be placed.")
            return

        log(f"SELL order rounded to nearest share; {shares_to_sell} shares (${shares_to_sell_value} in value) will be sold.")

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
        log("Checking market status and trade viability...")

        symbol = SYMBOL.upper()
        asset = trading_client.get_asset(symbol)
        if not asset.tradable or not asset.fractionable:
            raise Exception(f"{SYMBOL} is not tradable or fractionable.")
        
        all_positions = trading_client.get_all_positions()
        if len(all_positions) >= 2:
            raise Exception("You already have 2 or more traded assets in this account. This software is only intended for use of one symbol")
        elif len(all_positions) == 1 and all_positions[0].symbol != symbol:
            raise Exception(f"You have an open position that is not {symbol}. You can only run this software with one symbol")
        
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

# Register an HTTP function with the Functions Framework
@functions_framework.http
def hello_http(request):
  trade()
  return 'OK'

'''
if __name__ == "__main__":
    trade()
'''