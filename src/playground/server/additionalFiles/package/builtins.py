# Builtin functions
import pandas as pd

# RSI Calculation
def rsi(column: pd.Series, n: int = 14) -> pd.Series:
    """
    Calculate the Relative Strength Index (RSI) of a given pandas Series.

    Parameters:
        column (pd.Series): The column of a DataFrame to calculate RSI for.
        n (int, optional): The look-back period for RSI calculation. Default is 14.

    Returns:
        pd.Series: A pandas Series containing the RSI values.
    """
    if len(column) < n:
        raise ValueError("Column length must be greater than or equal to the look-back period (n).")

    # Calculate the differences
    delta = column.diff()

    # Separate positive and negative gains
    gain = np.where(delta > 0, delta, 0)
    loss = np.where(delta < 0, -delta, 0)

    # Calculate the average gain and loss using exponential moving average
    avg_gain = pd.Series(gain).rolling(window=n, min_periods=n).mean()
    avg_loss = pd.Series(loss).rolling(window=n, min_periods=n).mean()

    # Calculate the relative strength (RS)
    rs = avg_gain / avg_loss

    # Calculate the RSI
    rsi = 100 - (100 / (1 + rs))

    # Return RSI as a pandas Series with the same index as the input column
    return pd.Series(rsi, index=column.index, name=f'RSI_{n}')   

# Moving Average Calculation
def movAvg(column: pd.Series, n: int = 20) -> pd.Series:
    """
    Calculate the Moving Average (MA) for a given column.

    Args:
        column (pd.Series): The input column from a DataFrame.
        n (int): The period for calculating MA. Default is 20.

    Returns:
        pd.Series: A pandas Series containing the MA values.
    """
    return column.rolling(window=n).mean()

# Exponential Moving Average Calculation
def ema(column: pd.Series, n: int = 20) -> pd.Series:
    """
    Calculate the Exponential Moving Average (EMA) for a given column.

    Args:
        column (pd.Series): The input column from a DataFrame.
        n (int): The period for calculating EMA. Default is 20.

    Returns:
        pd.Series: A pandas Series containing the EMA values.
    """
    return column.ewm(span=n, adjust=False).mean()

# Bollinger Bands Calculation
def bollinger(column: pd.Series, n: int = 20, num_std_dev: int = 2):
    """
    Calculate Bollinger Bands for a given column.

    Args:
        column (pd.Series): The input column from a DataFrame.
        n (int): The period for calculating Bollinger Bands. Default is 20.
        num_std_dev (int): The number of standard deviations for the bands. Default is 2.

    Returns:
        tuple: A tuple containing three pandas Series (middle band, upper band, lower band).
    """
    ma = column.rolling(window=n).mean()
    std_dev = column.rolling(window=n).std()
    upper_band = ma + (std_dev * num_std_dev)
    lower_band = ma - (std_dev * num_std_dev)
    return ma, upper_band, lower_band

# MACD Calculation
def macd(column: pd.Series, short_window: int = 12, long_window: int = 26, signal_window: int = 9):
    """
    Calculate the Moving Average Convergence Divergence (MACD) for a given column.

    Args:
        column (pd.Series): The input column from a DataFrame.
        short_window (int): The short EMA period. Default is 12.
        long_window (int): The long EMA period. Default is 26.
        signal_window (int): The signal line EMA period. Default is 9.

    Returns:
        tuple: A tuple containing three pandas Series (MACD line, Signal line, MACD histogram).
    """
    short_ema = column.ewm(span=short_window, adjust=False).mean()
    long_ema = column.ewm(span=long_window, adjust=False).mean()
    macd_line = short_ema - long_ema
    signal_line = macd_line.ewm(span=signal_window, adjust=False).mean()
    macd_histogram = macd_line - signal_line
    return macd_line, signal_line, macd_histogram