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

API_KEY = "PKI39DIKVDM0DECMXBQO"
API_SECRET = "JMVgdC48fBPZeu0x7zUQtGYQ3TSZetN9hII1L7U7"

SYMBOL = "1dd2"
TIMEPOINTS = 100
TRADING_FREQUENCY = TimeFrameUnit.Minute

trading_client = TradingClient(API_KEY, API_SECRET, paper=True)
historical_client = StockHistoricalDataClient(API_KEY, API_SECRET)

def log(message, level="INFO"):
    """Helper function to print logs with timestamps."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

def strategy(data):
    log("Running strategy on historical data.")
    data["signal"] = 1  # Simple strategy: always buy
    return data

def get_historical_data(symbol: str) -> pd.DataFrame:
    now = datetime.now(ZoneInfo("America/New_York"))
    log(f"Fetching historical data for {symbol}...")

    historical_data_details = StockBarsRequest(
        symbol_or_symbols=[symbol],
        timeframe=TimeFrame(amount=3, unit=TRADING_FREQUENCY),
        start=now - timedelta(days=365),
        limit=TIMEPOINTS,
    )
    
    bars = historical_client.get_stock_bars(historical_data_details).df
    bars = bars.reset_index()
    
    log(f"Retrieved {len(bars)} bars for {symbol}.")
    return bars[["timestamp", "open", "high", "low", "close", "volume"]]  # Keep relevant columns

def get_position_value(symbol: str) -> float:
    """Gets the current market value of an open position."""
    try:
        position = trading_client.get_open_position(symbol)
        value = float(position.market_value)
        log(f"Current position in {symbol}: ${value:.2f}")
        return value
    except Exception:
        log(f"No open position found for {symbol}.", level="WARNING")
        return 0  # No position found

def execute_trade(symbol: str):
    log(f"Executing trade for {symbol}...")

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
    log(f"Portfolio Value: ${portfolio_value:.2f}, Target Equity: ${target_equity:.2f}, Money to Move: ${money_to_move:.2f}")

    if (current_equity > 0 and target_equity < 0) or (current_equity < 0 and target_equity > 0):
        log(f"Because moving from a short->buy, or buy->short, we must first exit our current position. Closing position in {symbol}. ")
        trading_client.close_position(symbol)
        money_to_move += current_equity
        log(f"Money to Move (updated): ${money_to_move:.2f}")

    if money_to_move > 0:
        log(f"Placing BUY order for ${abs(money_to_move):.2f} of {symbol}.")
        order_details = MarketOrderRequest(
            symbol=symbol,
            notional=abs(money_to_move), 
            side=OrderSide.BUY, 
            time_in_force=TimeInForce.DAY
        )
    elif money_to_move < 0:
        log(f"Placing SELL order for ${abs(money_to_move):.2f} of {symbol}.")
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

def trade():

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

if __name__ == "__main__":
    trade()
