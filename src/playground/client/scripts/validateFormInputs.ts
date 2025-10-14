import { intVals } from "../../../shared/sharedTypes";

function validateFormInputs({ formInputs }: any) {
  const {
    symbol,
    startDate,
    endDate,
    intval,
    timeout,
    useWarmupDate,
    warmupDate,
    costPerTrade,
  } = formInputs;

  // Check for missing inputs
  if (!startDate || !endDate || !symbol || !intval || !timeout) {
    throw new Error(
      "Missing input entries. Please provide 'symbol', 'start date', 'end date', and 'trading frequency'",
    );
  }

  if (useWarmupDate && !warmupDate) {
    throw new Error(
      "If utilizing the warm-up period, make sure to include a warm-up start date.",
    );
  }

  // Check if start date is before end date
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error("Start date cannot be later than the end date.");
  }

  // Check to make sure date starts in legit range
  const cutoff = new Date("1970-01-01").getTime();
  if (
    new Date(startDate).getTime() < cutoff ||
    new Date(endDate).getTime() < cutoff
  ) {
    throw new Error("Start date or end date cannot fall before 1970.");
  }

  // Check if symbol is alphanumeric and between 1 and 5 characters (typical for stock symbols)
  const symbolRegex = /^[A-Za-z0-9^]{1,6}$/;
  if (!symbolRegex.test(symbol)) {
    throw new Error(
      "Symbol must be alphanumeric (or ^ for indices) and between 1 to 6 characters.",
    );
  }

  // Define allowed interval values
  if (!intVals.includes(intval)) {
    throw new Error(
      `Invalid interval. Allowed values are: ${intVals.join(", ")}.`,
    );
  }

  if (isNaN(Number(timeout))) {
    throw new Error("Execution time limit must be a number.");
  }

  // Check timeout is a valid integer
  if (!Number.isInteger(Number(timeout))) {
    throw new Error("Execution time limit must be an integer.");
  }

  if (timeout < 1 || timeout > 60) {
    throw new Error("Execution time limit must fall between 1 and 60 seconds.");
  }

  // Check if start date and end date are within a reasonable range (e.g., within the last 20 years)
  const today = new Date();

  if (useWarmupDate) {
    const wDate = new Date(warmupDate);
    if (wDate > today) {
      throw new Error("Warm-up dates cannot be in the future.");
    }
    if (wDate >= new Date(startDate)) {
      throw new Error("Warm-up date cannot come after/on the start date.");
    }
  }

  // Check if startDate and endDate are not in the future
  if (new Date(startDate) > today || new Date(endDate) > today) {
    throw new Error("Dates cannot be in the future.");
  }

  // Validate costpertrade value
  if (isNaN(Number(costPerTrade))) {
    throw new Error("Trading Cost must be a number.");
  }

  if (costPerTrade > 10 || costPerTrade < 0) {
    throw new Error("Trading Cost must fall between 0 and 10%.");
  }
}

export default validateFormInputs;
