function validateFormInputs({formInputs}: any) {

    const { symbol, startDate, endDate, intval, timeOfDay } = formInputs;

    // Check for missing inputs
    if (!startDate || !endDate || !symbol || !intval || !timeOfDay) {
        throw new Error("Missing input entries. Please provide 'symbol', 'startDate', 'endDate', and 'intval'.");
    }

    // Check for valid date format (assuming format is YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        throw new Error("Invalid date format. Dates must be in the format 'YYYY-MM-DD'.");
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
    const allowedIntervals = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', 'ytd', 'max'];
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
    const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    if (new Date(startDate) < twentyYearsAgo || new Date(endDate) < twentyYearsAgo) {
        throw new Error("Dates must be within the last 20 years.");
    }

    // Check if start date and end date are at least 3 days apart
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const differenceInDays = (end - start) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    if (differenceInDays < 3) {
        throw new Error("Start date and end date must be at least 3 days apart.");
    }

    // Check if startDate and endDate are not in the future
    if (new Date(startDate) > today || new Date(endDate) > today) {
        throw new Error("Dates cannot be in the future.");
    }
}

export default validateFormInputs;
