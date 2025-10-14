import { StrategyResultProps, StatProps } from "../../shared/sharedTypes";

class PortfolioCalculator {
  private costPerTrade: number;
  private readonly decimalPlaces: number = 4;
  private strategyResult: StrategyResultProps;

  constructor(costPerTrade: number, strategyResult: StrategyResultProps) {
    this.strategyResult = strategyResult;
    this.costPerTrade = costPerTrade;
  }

  public calculate() {
    const tradingCost = this.costPerTrade / 100;

    this.strategyResult.portfolio[0] = 1;
    this.strategyResult.portfolioWithCosts[0] =
      1 - Math.abs(tradingCost * this.strategyResult.signal[0]);
    this.strategyResult.returns[0] = 0;

    this.strategyResult.equity[0] = this.strategyResult.signal[0];
    this.strategyResult.cash[0] = 1 - Math.abs(this.strategyResult.equity[0]);

    this.strategyResult.equityWithCosts[0] =
      this.strategyResult.portfolioWithCosts[0] * this.strategyResult.signal[0];
    this.strategyResult.cashWithCosts[0] =
      this.strategyResult.portfolioWithCosts[0] -
      Math.abs(this.strategyResult.equityWithCosts[0]);

    for (let i = 1; i < this.strategyResult.timestamp.length; i++) {
      const curr = this.strategyResult["close"][i];
      const prev = this.strategyResult["close"][i - 1];
      let stockRet = (curr - prev) / prev;

      if (this.strategyResult.signal[i - 1] < 0) {
        stockRet = -1 * stockRet;
      }

      this.strategyResult.equity[i] =
        this.strategyResult.equity[i - 1] * (1 + stockRet);
      this.strategyResult.equityWithCosts[i] =
        this.strategyResult.equityWithCosts[i - 1] * (1 + stockRet);

      const currPort =
        Math.abs(this.strategyResult.equity[i]) +
        this.strategyResult.cash[i - 1];
      this.strategyResult.portfolio[i] = currPort;
      this.strategyResult.portfolioWithCosts[i] =
        Math.abs(this.strategyResult.equityWithCosts[i]) +
        this.strategyResult.cashWithCosts[i - 1];

      const prevPort = this.strategyResult.portfolio[i - 1];
      this.strategyResult.returns[i] = (currPort - prevPort) / prevPort;

      const currSignal = this.strategyResult.signal[i];
      const prevSignal = this.strategyResult.signal[i - 1];

      if (currSignal != prevSignal) {
        this.strategyResult.equity[i] =
          this.strategyResult.portfolio[i] * currSignal;

        const tradeValue = Math.abs(
          this.strategyResult.portfolioWithCosts[i] * (currSignal - prevSignal),
        );
        this.strategyResult.portfolioWithCosts[i] =
          this.strategyResult.portfolioWithCosts[i] - tradeValue * tradingCost;
        this.strategyResult.equityWithCosts[i] =
          this.strategyResult.portfolioWithCosts[i] * currSignal;
      }

      this.strategyResult.cash[i] = Math.max(
        0,
        this.strategyResult.portfolio[i] -
          Math.abs(this.strategyResult.equity[i]),
      );
      this.strategyResult.cashWithCosts[i] = Math.max(
        0,
        this.strategyResult.portfolioWithCosts[i] -
          Math.abs(this.strategyResult.equityWithCosts[i]),
      );
    }

    this.strategyResult.returns = this.strategyResult.returns.map((val) =>
      this.roundTo(val),
    );
    this.strategyResult.portfolio = this.strategyResult.portfolio.map((val) =>
      this.roundTo(val),
    );
    this.strategyResult.portfolioWithCosts =
      this.strategyResult.portfolioWithCosts.map((val) => this.roundTo(val));
    this.strategyResult.cash = this.strategyResult.cash.map((val) =>
      this.roundTo(val),
    );
    this.strategyResult.equity = this.strategyResult.equity.map((val) =>
      this.roundTo(val),
    );

    return this.strategyResult;
  }

  private roundTo(value: number): number {
    return (
      Math.round(value * 10 ** this.decimalPlaces) / 10 ** this.decimalPlaces
    );
  }

  public statistics(): StatProps {
    const length = this.strategyResult.portfolio.length - 1;

    // Calculate total profit/loss
    const pl =
      (100 *
        (this.strategyResult.portfolio[length] -
          this.strategyResult.portfolio[0])) /
      this.strategyResult.portfolio[0];
    const plWCosts =
      (100 *
        (this.strategyResult.portfolioWithCosts[length] -
          this.strategyResult.portfolioWithCosts[0])) /
      this.strategyResult.portfolio[0];

    // Convert Unix timestamps to JavaScript Date objects
    const firstDate = new Date(this.strategyResult.timestamp[0]).getTime();
    const lastDate = new Date(this.strategyResult.timestamp[length]).getTime();

    const numberOfDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const cagr =
      ((this.strategyResult.portfolio[length] /
        this.strategyResult.portfolio[0]) **
        (365 / numberOfDays) -
        1) *
      100;

    let numberOfTrades = 0;
    let numberOfProfitableTrades = 0;
    let peak = this.strategyResult.portfolio[0];
    let maxDrawdown = 0;

    const hasInitialTrade = this.strategyResult.signal[0] !== 0;
    let buyPrice = this.strategyResult.portfolio[0];

    for (let i = 1; i <= length; i++) {
      if (this.strategyResult.signal[i] !== this.strategyResult.signal[i - 1]) {
        numberOfTrades++;

        if (this.strategyResult.portfolio[i] > buyPrice) {
          numberOfProfitableTrades++;
        }

        buyPrice = this.strategyResult.portfolio[i];
      }

      if (this.strategyResult.portfolio[i] > peak) {
        peak = this.strategyResult.portfolio[i];
      }

      const drawdown = (peak - this.strategyResult.portfolio[i]) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    if (hasInitialTrade && numberOfTrades === 0) {
      numberOfTrades = 1;
      if (
        this.strategyResult.portfolio[length] > this.strategyResult.portfolio[0]
      ) {
        numberOfProfitableTrades++;
      }
    }

    const percTradesProf =
      numberOfTrades !== 0
        ? (100 * numberOfProfitableTrades) / numberOfTrades
        : 0;
    const maxGain =
      (100 *
        (Math.max(...this.strategyResult.portfolio) -
          this.strategyResult.portfolio[0])) /
      this.strategyResult.portfolio[0];
    const returns = this.strategyResult.returns.slice(1); // dont include the first 0% return

    // Initialize variables for sum, max, min
    let sum = 0;
    let max = -Infinity;
    let min = Infinity;

    // First pass: calculate sum, max, and min
    for (const ret of returns) {
      sum += ret;
      if (ret > max) max = ret;
      if (ret < min) min = ret;
    }

    // Calculate average return
    const meanReturn = sum / returns.length;

    // Second pass: calculate variance and ratios
    const variance =
      returns.reduce(
        (sum: number, ret: number) => sum + Math.pow(ret - meanReturn, 2),
        0,
      ) / returns.length;
    const stdDev = Math.sqrt(variance);
    const negativeReturns = returns.filter((ret: number) => ret < 0);
    const downsideVariance =
      negativeReturns.reduce(
        (sum: number, ret: number) => sum + Math.pow(ret, 2),
        0,
      ) / (negativeReturns.length || 1);
    const downsideDev = Math.sqrt(downsideVariance);
    const riskFreeRate = 0;
    const sharpeRatio =
      numberOfTrades !== 0 ? (meanReturn - riskFreeRate) / stdDev : null;
    const sortinoRatio =
      numberOfTrades !== 0 ? (meanReturn - riskFreeRate) / downsideDev : null;

    return {
      length: this.strategyResult.portfolio.length,
      pl: pl,
      plWCosts: plWCosts,
      cagr: cagr,
      numTrades: numberOfTrades,
      numProfTrades: numberOfProfitableTrades,
      percTradesProf: percTradesProf,
      sharpeRatio: sharpeRatio,
      sortinoRatio: sortinoRatio,
      maxDrawdown: 100 * maxDrawdown,
      maxGain: maxGain,
      meanReturn: 100 * meanReturn,
      stddevReturn: 100 * stdDev,
      maxReturn: 100 * max,
      minReturn: 100 * min,
    };
  }
}

export default PortfolioCalculator;
