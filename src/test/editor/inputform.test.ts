import { describe, it, expect } from 'vitest';
import validateFormInputs from '../../playground/client/scripts/validateFormInputs';
import { addMonths } from '../../playground/client/scripts/addMonths';
import { initFormInputs } from '../../playground/client/components/initFormInputs';

describe('Form Input Validation', () => {

    it('Symbol should be alphanumeric and between 1 to 6 characters', () => {
        const invalidSymbols = [
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

    it('Warm-up date required when using warm-up option', () => {
        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, useWarmupDate: true, warmupDate: '' }
        })).toThrow("If utilizing the warm-up period, make sure to include a warm-up start date.");
    });

    it('Timeout value non-numerics', () => {
        const invalidTimeouts = ['hi'];
        invalidTimeouts.forEach(timeout => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, timeout }
            })).toThrow("Execution time limit must be a number.");
        });
    });

    it('Timeout value constraints', () => {
        const invalidTimeouts = [-1, 70]; // Assuming valid range is [1, 60]
        invalidTimeouts.forEach(timeout => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, timeout }
            })).toThrow("Execution time limit must fall between 1 and 60 seconds.");
        });
    });

    it('Timeout must be a whole number', () => {
        const invalidTimeouts = [.1, -.7];
        invalidTimeouts.forEach(timeout => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, timeout }
            })).toThrow("Execution time limit must be an integer.");
        });
    });

    it('Cost per trade must be within valid range', () => {
        const invalidCosts = [-1, 11]; // Assuming valid range is [0, 10]
        invalidCosts.forEach(costPerTrade => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, costPerTrade }
            })).toThrow("Trading Cost must fall between 0 and 10%.");
        });
    });

    it('Cost per trade edge values should be valid', () => {
        const validCosts = [0, 0.01, 5, 10];
        validCosts.forEach(costPerTrade => {
            expect(() => validateFormInputs({
                formInputs: { ...initFormInputs, costPerTrade }
            })).not.toThrow();
        });
    });

    it('Warm-up date cannot be in the future or after start date', () => {
        const futureDate = addMonths(new Date(), 1);
        const afterStartDate = new Date();
        afterStartDate.setDate(afterStartDate.getDate() + 1);
    
        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, useWarmupDate: true, warmupDate: futureDate }
        })).toThrow("Warm-up dates cannot be in the future.");
    
        expect(() => validateFormInputs({
            formInputs: {
                ...initFormInputs,
                useWarmupDate: true,
                startDate: addMonths(new Date(), -20),
            }
        })).toThrow("Warm-up date cannot come after the start date.");
    });

    it('Start and end dates cannot be in the future', () => {
        const future = addMonths(new Date(), 2);
        const futureplus1 = addMonths(new Date, 3);

        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, startDate: future, endDate: futureplus1}
        })).toThrow("Dates cannot be in the future.");
    
        expect(() => validateFormInputs({
            formInputs: { ...initFormInputs, endDate: future }
        })).toThrow("Dates cannot be in the future.");
    });    

});
