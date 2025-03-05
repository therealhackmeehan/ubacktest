import pandas as pd
import numpy as np

def main():

    data = {'A': [1, 2, 3], 'B': [4, 5, 6]}
    df = pd.DataFrame(data)

    df['C'] = df['A'] + df['B']
    print(df)

if __name__ == "__main__":
    main()