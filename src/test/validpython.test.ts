import { describe, it, expect } from 'vitest';
import validatePythonCode from '../playground/client/scripts/validatePythonCode';

describe('Python Code Validation', () => {
    it('Should throw an error if no function is defined', () => {
        const code = "print('Hello, world!')";
        expect(() => validatePythonCode({ code })).toThrow("Code does not contain any function definitions.");
    });

    it("Should throw an error if 'strategy' function is missing", () => {
        const code = "def my_function(data):\n return data";
        expect(() => validatePythonCode({ code })).toThrow("Function 'strategy' is not defined or improperly named.");
    });

    it("Should throw an error if 'strategy' function has wrong parameters", () => {
        const code = "def strategy(param1, param2):\n return data";
        expect(() => validatePythonCode({ code })).toThrow("Function 'strategy' must have exactly one parameter named 'data'.");
    });

    it("Should throw an error if 'strategy' function does not return 'data'", () => {
        const code = "def strategy(data):\n return 42";
        expect(() => validatePythonCode({ code })).toThrow("Function 'strategy' must return 'data'.");
    });
});