import { describe, it, expect } from 'vitest';
import calculateStats from '../playground/client/scripts/calculateStats';
import { StrategyResultProps } from '../shared/sharedTypes';

const sampleData: StrategyResultProps = {
    timestamp: [1617235200, 1617321600, 1617408000, 1617494400, 1617580800, 1617667200], // Unix timestamps
    open: [100, 102, 104, 103, 105, 106],
    close: [102, 104, 103, 105, 107, 109],
    high: [103, 105, 106, 107, 108, 110],
    low: [99, 101, 102, 101, 103, 104],
    volume: [1000, 1500, 1200, 1300, 1400, 1600],

    signal: [0, 1, 0, -1, 0, 1], // Example signals: 1 for buy, -1 for sell, 0 for hold
    returns: [0, 0.02, -0.01, 0.02, 0.03, 0.02], // Example returns: percentage changes
    sp: [100, 102, 101, 103, 105, 106], // S&P 500 index values (just for comparison)
    
    portfolio: [100000, 102000, 101500, 103000, 106000, 108000], // Portfolio value at each timestamp
    portfolioWithCosts: [100000, 101500, 101200, 102500, 105000, 107500], // Portfolio with transaction costs

    cash: [100000, 100000, 100000, 100000, 100000, 100000], // Example cash balance
    equity: [100000, 102000, 101500, 103000, 106000, 108000], // Total equity (portfolio value + cash)
    
    cashWithCosts: [100000, 100000, 100000, 100000, 100000, 100000], // Cash with costs
    equityWithCosts: [100000, 101500, 101200, 102500, 105000, 107500], // Equity with transaction costs

    userDefinedData: {} // Placeholder for any user-defined data
};

describe('Calculate Stats', () => {
    it('Should correctly compute trading performance metrics', () => {
        const stats = calculateStats(sampleData);

        // Check general stats
        expect(stats).toHaveProperty('length', 6);
        expect(stats).toHaveProperty('pl');
        expect(stats.pl).toBeNull(); // or match expected string value
        expect(stats).toHaveProperty('plWCosts');
        expect(stats.plWCosts).toBeNull(); // or match expected value
        expect(stats).toHaveProperty('annualizedPl');
        expect(stats.annualizedPl).toBeNull(); // or match expected value

        // Portfolio performance checks
        expect(stats).toHaveProperty('numTrades', 5); // Assuming trades are made at 5 points
        expect(stats).toHaveProperty('numProfTrades', 3); // Assuming 3 profitable trades
        expect(stats).toHaveProperty('percTradesProfit');
        expect(stats.percTradesProfit).toBe('60%'); // Example percentage

        // Risk and return metrics
        expect(stats).toHaveProperty('sharpeRatio');
        expect(stats.sharpeRatio).toBeCloseTo(1.2, 1); // Example Sharpe ratio
        expect(stats).toHaveProperty('sortinoRatio');
        expect(stats.sortinoRatio).toBeCloseTo(1.1, 1); // Example Sortino ratio
        expect(stats).toHaveProperty('maxDrawdown');
        expect(stats.maxDrawdown).toBe('-5%'); // Example max drawdown

        // Profit and loss metrics
        expect(stats).toHaveProperty('maxGain');
        expect(stats.maxGain).toBe('15%'); // Example max gain
        expect(stats).toHaveProperty('meanReturn');
        expect(stats.meanReturn).toBe('2%'); // Example mean return
        expect(stats).toHaveProperty('stddevReturn');
        expect(stats.stddevReturn).toBe('3%'); // Example standard deviation return
        expect(stats).toHaveProperty('maxReturn');
        expect(stats.maxReturn).toBe('5%'); // Example max return
        expect(stats).toHaveProperty('minReturn');
        expect(stats.minReturn).toBe('-3%'); // Example min return

        // Specific performance checks
        expect(stats.maxDrawdown).toBeGreaterThan(0); // Max drawdown should be positive
        expect(stats.sharpeRatio).toBeDefined(); // Sharpe ratio should be defined
    });
});
