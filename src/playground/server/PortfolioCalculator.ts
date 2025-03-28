import { StrategyResultProps } from "../../shared/sharedTypes";

class PortfolioCalculator {

    private costPerTrade: number;
    private decimalPlaces: number = 4;
    private strategyResult: StrategyResultProps;

    constructor(costPerTrade: number, strategyResult: StrategyResultProps) {
        this.strategyResult = strategyResult;
        this.costPerTrade = costPerTrade;
    }

    public calculate() {

        const tradingCost = this.costPerTrade / 100;

        this.strategyResult.portfolio[0] = 1;
        this.strategyResult.portfolioWithCosts[0] = 1 - Math.abs(tradingCost * this.strategyResult.signal[0]);
        this.strategyResult.returns[0] = 0;

        this.strategyResult.equity[0] = this.strategyResult.signal[0];
        this.strategyResult.cash[0] = 1 - Math.abs(this.strategyResult.equity[0]);

        this.strategyResult.equityWithCosts[0] = this.strategyResult.portfolioWithCosts[0] * this.strategyResult.signal[0];
        this.strategyResult.cashWithCosts[0] = this.strategyResult.portfolioWithCosts[0] - Math.abs(this.strategyResult.equityWithCosts[0])

        for (let i = 1; i < this.strategyResult.timestamp.length; i++) {

            const curr = this.strategyResult['close'][i];
            const prev = this.strategyResult['close'][i - 1];
            let stockRet = (curr - prev) / prev;

            if (this.strategyResult.equity[i - 1] < 0) {
                stockRet = -1 * stockRet;
            }

            this.strategyResult.equity[i] = this.strategyResult.equity[i - 1] * (1 + stockRet);
            this.strategyResult.equityWithCosts[i] = this.strategyResult.equityWithCosts[i - 1] * (1 + stockRet);

            const currPort = Math.abs(this.strategyResult.equity[i]) + this.strategyResult.cash[i - 1];
            this.strategyResult.portfolio[i] = currPort;
            this.strategyResult.portfolioWithCosts[i] = Math.abs(this.strategyResult.equityWithCosts[i]) + this.strategyResult.cashWithCosts[i - 1];

            const prevPort = this.strategyResult.portfolio[i - 1];
            this.strategyResult.returns[i] = (currPort - prevPort) / prevPort;

            const currSignal = this.strategyResult.signal[i];
            const prevSignal = this.strategyResult.signal[i - 1];

            if (currSignal != prevSignal) {
                this.strategyResult.equity[i] = this.strategyResult.portfolio[i] * currSignal;

                const tradeValue = Math.abs(this.strategyResult.portfolioWithCosts[i] * (currSignal - prevSignal));
                this.strategyResult.portfolioWithCosts[i] = this.strategyResult.portfolioWithCosts[i] - (tradeValue * tradingCost);
                this.strategyResult.equityWithCosts[i] = this.strategyResult.portfolioWithCosts[i] * currSignal;
            }

            this.strategyResult.cash[i] = Math.max(0, this.strategyResult.portfolio[i] - Math.abs(this.strategyResult.equity[i]));
            this.strategyResult.cashWithCosts[i] = Math.max(0, this.strategyResult.portfolioWithCosts[i] - Math.abs(this.strategyResult.equityWithCosts[i]));

        }

        this.strategyResult.returns = this.strategyResult.returns.map(val => this.roundTo(val));
        this.strategyResult.portfolio = this.strategyResult.portfolio.map(val => this.roundTo(val));
        this.strategyResult.portfolioWithCosts = this.strategyResult.portfolioWithCosts.map(val => this.roundTo(val));
        this.strategyResult.cash = this.strategyResult.cash.map(val => this.roundTo(val));
        this.strategyResult.equity = this.strategyResult.equity.map(val => this.roundTo(val));

        return this.strategyResult;

    }

    private roundTo(value: number): number {
        return Math.round(value * 10 ** this.decimalPlaces) / (10 ** this.decimalPlaces);
    }
}

export default PortfolioCalculator;