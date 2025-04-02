import { describe, it, expect } from 'vitest';
import validateFormInputs from '../playground/client/scripts/validateFormInputs';
import { addMonths } from '../playground/client/components/StrategyEditor';
import { initFormInputs } from '../playground/client/components/StrategyEditor';

describe('Form Input Validation', () => {

    it('Symbol should be alphanumeric and between 1 to 6 characters', () => {
        const invalidSymbols = [
            { symbol: '' }, // Empty string
            { symbol: 'A' }, // 1 character (valid)
            { symbol: 'ABCDE' }, // 5 characters (valid)
            { symbol: 'ABCDEF' }, // 6 characters (valid)
            { symbol: 'ABC123' }, // 6 characters, alphanumeric (valid)
            { symbol: 'A1^' }, // 3 characters, valid with ^
            { symbol: 'A1^789' }, // 6 characters, valid with ^
            { symbol: 'A1^7890' }, // 7 characters (invalid)
            { symbol: 'A$B^' }, // Contains special character ($) (invalid)
            { symbol: 'AB&' }, // Contains special character (&) (invalid)
            { symbol: 'A1^#' }, // Contains special character (#) (invalid)
            { symbol: '1234567' }, // 7 characters (invalid)
            { symbol: 'ABCDEFG' }, // 7 characters (invalid)
        ];

        invalidSymbols.forEach(input => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, symbol: input.symbol }
            })).toThrow("Symbol must be alphanumeric (or ^ for indices) and between 1 to 6 characters.");
        });

        // Valid symbols
        const validSymbols = ['A', 'A1', 'ABC123', 'A1^', 'A1^5'];

        validSymbols.forEach(symbol => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, symbol }
            })).not.toThrow();
        });
    });

    it('Missing required fields should throw an error', () => {
        const invalidInputs = [
            { formInputs: { ...initFormInputs, symbol: '' } }, // Missing symbol
            { formInputs: { ...initFormInputs, startDate: '' } }, // Missing startDate
            { formInputs: { ...initFormInputs, endDate: '' } }, // Missing endDate
        ];

        invalidInputs.forEach(input => {
            expect(() => validateFormInputs(input)).toThrow("Missing input entries");
        });
    });

    it('Start date cannot be later than end date', () => {
        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, startDate: addMonths(new Date(), 1) }
        })).toThrow("Start date cannot be later than the end date");
    });

    it('Extremely old dates trigger an error', () => {
        const OneHundred = new Date();
        OneHundred.setFullYear(OneHundred.getFullYear() - 100);
        const OneHundredString = OneHundred.toISOString().slice(0, 10);

        const NinetyNine = new Date();
        NinetyNine.setFullYear(NinetyNine.getFullYear() - 99);
        const NinetyNineString = NinetyNine.toISOString().slice(0, 10);

        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, startDate: OneHundredString, endDate: NinetyNineString }
        })).toThrow("Start date or end date cannot fall before 1970.");
    });

    it('Excessively long date ranges trigger an error (>1000 timepoints)', () => {
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        const fiveYearsAgoString = fiveYearsAgo.toISOString().slice(0, 10);

        const farFutureDate = new Date();
        farFutureDate.setFullYear(farFutureDate.getFullYear() + 6);
        const farFutureDateString = farFutureDate.toISOString().slice(0, 10);

        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, startDate: fiveYearsAgoString, endDate: farFutureDateString }
        })).toThrow("The date range is too long. Please select a range under 1000 timepoints.");
    });

    it('Excessively short date ranges trigger an error (<3 days)', () => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const threeDaysAgoString = threeDaysAgo.toISOString().slice(0, 10);

        const today = new Date();
        const todayString = today.toISOString().slice(0, 10);

        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, startDate: threeDaysAgoString, endDate: todayString }
        })).toThrow("The date range is too short. Please select a range of at least 3 days.");
    });

    it('Warm-up date required when using warm-up option', () => {
        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, useWarmupDate: true, warmupDate: '' }
        })).toThrow("If utilizing the warm-up period, make sure to include a warm-up start date.");
    });

    it('Timeout value constraints', () => {
        const invalidTimeouts = [-1, 0.1, 70]; // Assuming valid range is [1, 60]

        invalidTimeouts.forEach(timeout => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, timeout }
            })).toThrow("Timeout must be between 1 and 60.");
        });
    });

    it('Cost per trade must be within valid range', () => {
        const invalidCosts = [-1, 11]; // Assuming valid range is [0, 10]

        invalidCosts.forEach(costPerTrade => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, costPerTrade }
            })).toThrow("Cost per trade must be between 0 and 10.");
        });
    });
});
