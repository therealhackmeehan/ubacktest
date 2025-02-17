export const alpacaCode = (strategyFcn: string) : string => {

   return `import alpaca_trade_api as tradeapi
import random
import time
from datetime import datetime
import pytz

# Alpaca API credentials
API_KEY = 'your_api_key'
API_SECRET = 'your_api_secret'
BASE_URL = 'https://paper-api.alpaca.markets'

# Create Alpaca API instance
api = tradeapi.REST(API_KEY, API_SECRET, BASE_URL, api_version='v2')

# Get account information
account = api.get_account()

# Function to get the current time in market timezone (Eastern Time)
def get_market_time():
    eastern = pytz.timezone('US/Eastern')
    return datetime.now(eastern)

# Function to check if market is open
def is_market_open():
    clock = api.get_clock()
    return clock.is_open

# Function to execute the trade
def execute_trade():
    # Get portfolio value
    portfolio_value = float(account.cash)

    # Generate trading signal by applying strategy

    # Calculate amount to trade
    amount_to_trade = portfolio_value * trade_fraction

    # Choose a stock (for example, Apple - AAPL)
    symbol = 'AAPL'

    # Submit a market order to buy the amount calculated
    api.submit_order(
        symbol=symbol,
        qty=amount_to_trade,
        side='buy',
        type='market',
        time_in_force='gtc'
    )
    print(f"Executed trade: {amount_to_trade} of {symbol} at {get_market_time()}")

# Main function to execute trades every 10 minutes while the market is open
def trade():
    while True:
        if is_market_open():
            execute_trade()
            # Wait for 10 minutes before executing again
            time.sleep(600)  # 600 seconds = 10 minutes
        else:
            print("Market is closed. Waiting for market to open...")
            time.sleep(60)  # Check every minute if market opens

if __name__ == "__main__":
    trade()`}

export default alpacaCode;
