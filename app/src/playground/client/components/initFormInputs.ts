import { FormInputProps } from "../../../shared/sharedTypes";
import { addMonths } from "../scripts/addMonths";

export const initFormInputs: FormInputProps = {
  symbol: "AAPL",
  startDate: addMonths(new Date(), -12), // 12 months ago
  endDate: addMonths(new Date(), -6), // 6 months ago
  intval: "daily",
  timeout: 12,
  costPerTrade: 0,
  useWarmupDate: false,
  warmupDate: addMonths(new Date(), -13),
  useAdjClose: true,
};
