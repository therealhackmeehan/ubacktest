import os
import importlib.util
import pandas as pd
import yfinance as yf

def execute_strategy_in_folder(folder_path, stock_data_df):
    """
    Executes all 'strategy' functions found in Python files within the specified folder (and subfolders).
    
    Args:
        folder_path (str): The path to the folder where Python files are stored.
        stock_data_df (pd.DataFrame): The stock data to be passed as input to the strategy functions.
    """
    # Walk through the directory and its subdirectories
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.py'):  # Look for Python files
                file_path = os.path.join(root, file)
                # Dynamically import the Python file
                spec = importlib.util.spec_from_file_location(file, file_path)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                
                # Ensure the 'strategy' function exists and execute it
                try:
                    print(f"Executing strategy from {file_path}")
                    result = module.strategy(stock_data_df)
                    # Process the result here (for example, print it or store it)
                    print(result)
                except Exception as e:
                    print(f"Error executing strategy in {file_path}: {e}")

from datetime import datetime

# CREATE TICKER INSTANCE FOR AMAZON
amzn = yf.Ticker("AMZN")

# GET TODAYS DATE AND CONVERT IT TO A STRING WITH YYYY-MM-DD FORMAT (YFINANCE EXPECTS THAT FORMAT)
end_date = datetime.now().strftime('%Y-%m-%d')
amzn_hist = amzn.history(start='2022-01-01',end=end_date)

data = amzn_hist.rename(columns={
    'Open': 'open',
    'High': 'high',
    'Low': 'low',
    'Close': 'close',
    'Volume': 'volume'
})

print(data)

execute_strategy_in_folder('python', data)
