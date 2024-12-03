function validatePythonCode({ code }: {code : string}): void {
    const errorHelper =
        " You must define a function named strategy with one input, data, and return one output, data. All functions should contain the following: \n\n def strategy(data):\n # some code of yours... \n\t\treturn data";

    // Check 1: Basic validation for Python syntax by looking for 'def'
    if (!code.includes('def')) {
        throw new Error(
            "Code does not contain any function definitions. " + errorHelper
        );
    }

    // Check 2: Ensure function named 'mystrategy' is defined
    const functionRegex = /def\s+strategy\s*\(([^)]*)\)\s*:/;
    const functionMatch = code.match(functionRegex);
    if (!functionMatch) {
        throw new Error(
            "Function 'strategy' is not defined or improperly named. " + errorHelper
        );
    } else {
        // Check 3: Validate that 'mystrategy' has exactly one parameter named 'data'
        const params = functionMatch[1].trim();
        if (params !== "data") {
            throw new Error(
                "Function 'strategy' must have exactly one parameter named 'data'. " + errorHelper
            );
        }
    }

    // Check 4: Ensure the function 'mystrategy' returns 'data'
    const returnRegex = /return\s+data\b/;
    if (!returnRegex.test(code)) {
        throw new Error(
            "Function 'strategy' must return 'data'. " + errorHelper
        );
    }
}

export default validatePythonCode;
