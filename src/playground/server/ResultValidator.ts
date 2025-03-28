import { HttpError } from "wasp/server";
import { StrategyResultProps } from "../../shared/sharedTypes";

class ResultValidator {

    public static validatePortfolio(strategyResult: StrategyResultProps): void {

        // for each of the crucial columns, check they all match in length
        const requiredKeys: (keyof StrategyResultProps)[] = ['portfolio', 'portfolioWithCosts', 'signal', 'returns'];
        const lengths = requiredKeys.map(key => strategyResult[key]?.length);
        const allLengthsMatch = lengths.every(length => length === lengths[0]);

        if (!allLengthsMatch || lengths.some(length => length === 0)) {
            throw new HttpError(500, 'Your portfolio arrays are missing or mismatched in length.');
        }

        // for each crucial columns, make sure data is real and valid
        const allDataIsValid = requiredKeys.every(key => {
            const data = strategyResult[key];
            return Array.isArray(data) && data.every(
                value => value !== null && value !== undefined && !Number.isNaN(value)
            );
        });

        if (!allDataIsValid) {
            throw new HttpError(500, 'Your portfolio contains invalid data (null, undefined, or NaN).');
        }

        // (shouldn't ever happen) make sure portfolio is positive
        const portfoliosNonNegative = strategyResult.portfolio.every(value => value >= 0) &&
            strategyResult.portfolioWithCosts.every(value => value >= 0);
        if (!portfoliosNonNegative) {
            throw new HttpError(500, 'Your portfolio contains negative values, which is not allowed.');
        }

        // make sure trading signals fall within allowed range 
        const returnsWithinBounds = strategyResult.returns.every(value => value >= -1 && value <= 1);
        if (!returnsWithinBounds) {
            throw new HttpError(500, 'Your portfolio returns contain unrealistic values.');
        }

        // check timestamps for valid idx trend
        const timestampsAreMonotonic = strategyResult.timestamp.every(
            (value, index, array) => index === 0 || value > array[index - 1]
        );
        if (!timestampsAreMonotonic) {
            throw new HttpError(500, 'Timestamps in your portfolio data are not in chronological order.');
        }
    }
}

export default ResultValidator;