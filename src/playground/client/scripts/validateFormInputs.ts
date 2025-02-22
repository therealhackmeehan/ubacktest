function validateFormInputs({ formInputs }: any) {

    const { symbol, startDate, endDate, intval, timeOfDay, useWarmupDate, warmupDate } = formInputs;

    // Check for missing inputs
    if (!startDate || !endDate || !symbol || !intval ) {
        throw new Error("Missing input entries. Please provide 'symbol', 'start date', 'end date', and 'trading frequency'");
    }

    if (useWarmupDate && !warmupDate) {
        throw new Error("If utilizing the warm-up period, make sure to include a warm-up start date.")
    }

    // Check if start date is before end date
    if (new Date(startDate) > new Date(endDate)) {
        throw new Error("Start date cannot be later than the end date.");
    }

    // Check if symbol is alphanumeric and between 1 and 5 characters (typical for stock symbols)
    const symbolRegex = /^[A-Za-z0-9]{1,5}$/;
    if (!symbolRegex.test(symbol)) {
        throw new Error("Symbol must be alphanumeric and between 1 to 5 characters.");
    }

    // Define allowed interval values
    const allowedIntervals = ['1m', '2m', '5m', '15m', '30m', '1h', '90m', '1d', '5d', '1wk', '1mo', '3mo'];
    if (!allowedIntervals.includes(intval)) {
        throw new Error(`Invalid interval. Allowed values are: ${allowedIntervals.join(", ")}.`);
    }

    // allowed timeOfDay
    const allowedTimeOfDay = ['open', 'close', 'high', 'low'];
    if (!allowedTimeOfDay.includes(timeOfDay)) {
        throw new Error(`Invalid executution time. Allowed values are: ${allowedTimeOfDay.join(", ")}.`)
    }

    // Check if start date and end date are within a reasonable range (e.g., within the last 20 years)
    const today = new Date();

    if (useWarmupDate) {
        const wDate = new Date(warmupDate);
        if (wDate > today) {
            throw new Error("Warm-up dates cannot be in the future.");
        }
        if (wDate > new Date(startDate)) {
            throw new Error("Warm-up date cannot come after the start date.");
        }
    }

    // Check if startDate and endDate are not in the future
    if (new Date(startDate) > today || new Date(endDate) > today) {
            throw new Error("Dates cannot be in the future.");
        }
}

export default validateFormInputs;
