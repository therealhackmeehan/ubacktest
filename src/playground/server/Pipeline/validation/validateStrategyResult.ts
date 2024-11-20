import { HttpError } from "wasp/server";

function validateStrategyResult({ data }: { data: any }) {
    const portfolioValues = data.portfolio;
    const signals = data.signal; // Assuming signals are passed within data
    const closes = data.close; // Assuming closes (daily prices) are passed within data

    // Check 1: Portfolio values should always be numbers and never be NaN or Infinity
    for (let i = 0; i < portfolioValues.length; i++) {
        if (typeof portfolioValues[i] !== "number" || !isFinite(portfolioValues[i])) {
            throw new HttpError(
                500,
                `Portfolio value at index ${i} is invalid: ${portfolioValues[i]}. Ensure the strategy calculation produces valid numeric results.`
            );
        }
    }

    // Check 2: Signals should only contain values between -1 and 1 inclusive
    for (let i = 0; i < signals.length; i++) {
        if (typeof signals[i] !== "number" || signals[i] < -1 || signals[i] > 1) {
            throw new HttpError(
                400,
                `Invalid signal at index ${i}: ${signals[i]}. Signals must be between -1 (sell), 0 (hold), and 1 (buy).`
            );
        }
    }

    // Check 3: Ensure portfolio values are logical (e.g., non-negative)
    for (let i = 0; i < portfolioValues.length; i++) {
        if (portfolioValues[i] < 0) {
            throw new HttpError(
                500,
                `Portfolio value at index ${i} is negative: ${portfolioValues[i]}. Ensure calculations produce realistic portfolio values.`
            );
        }
    }

    // Check 4: Signals and closes should be the same length
    if (signals.length !== closes.length) {
        throw new HttpError(
            400,
            "Signal array and stock close prices array lengths do not match. Ensure each data point has a corresponding signal."
        );
    }
}

export default validateStrategyResult;
