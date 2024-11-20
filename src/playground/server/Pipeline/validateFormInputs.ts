interface validateFormProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
}

function validateFormInputs({symbol, startDate, endDate, intval}: validateFormProps) {

    if (!startDate || !endDate || !symbol || !intval) {
        throw new Error('You are missing some input entries.');
    }

    // Check for valid date format (assuming format is YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        throw new Error('Date format should be YYYY-MM-DD.');
    }

    // Check if start date is before end date
    if (new Date(startDate) > new Date(endDate)) {
        throw new Error('Start date cannot be later than end date.');
    }

    // Check if symbol is alphanumeric and between 1 and 5 characters (typical for stock symbols)
    const symbolRegex = /^[A-Za-z0-9]{1,5}$/;
    if (!symbolRegex.test(symbol)) {
        throw new Error('Symbol should be alphanumeric and between 1 to 5 characters.');
    }

    // Define allowed interval values
    const allowedIntervals = ['1m', '5m', '15m', '30m', '1h', '1d', '1w', '1m', '1y'];

    // Check if intval is one of the allowed values
    if (!allowedIntervals.includes(intval)) {
        throw new Error("Interval must be one of the following: '1m', '5m', '15m', '30m', '1h', '1d', '1w', '1m', '1y'");
    }

    // Check if start date and end date are within a reasonable range (e.g., within the last 20 years)
    const today = new Date();
    const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    if (new Date(startDate) < twentyYearsAgo || new Date(endDate) < twentyYearsAgo) {
        throw new Error('Dates should be within the last 20 years.');
    }

    // Check if start date and end date are at least 3 days apart
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const differenceInDays = (end - start) / (1000 * 60 * 60 * 24); // Convert milliseconds to days


    if (differenceInDays < 3) {
        throw new Error('Start date and end date must be at least 3 days apart.');
    }

    // Check if startDate and endDate are not in the future
    if (new Date(startDate) > today || new Date(endDate) > today) {
        throw new Error('Dates cannot be in the future.');
    }
}

export default validateFormInputs;
