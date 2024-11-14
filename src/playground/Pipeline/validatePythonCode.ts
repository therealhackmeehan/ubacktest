interface CodeProps {
    codeToDisplay: string;
}

function validatePythonCode({ codeToDisplay }: CodeProps): void {

    const errorHelper = " You must define a function named mystrategy with one input, data, and return one output, data. All functions should contain the following: \n def myStrategy(data):\nreturn data";

    // Check 1: Basic validation for Python syntax by looking for 'def'
    if (!codeToDisplay.includes('def')) {
        throw new Error("Code does not contain any function definitions." + errorHelper);
    }

    // Check 2: Ensure function named 'mystrategy' is defined
    const functionRegex = /def\s+mystrategy\s*\(([^)]*)\)\s*:/;
    const functionMatch = codeToDisplay.match(functionRegex);
    if (!functionMatch) {
        throw new Error("Function 'mystrategy' is not defined or improperly named." + errorHelper);
    } else {
        // Check 3: Validate that 'mystrategy' has exactly one parameter named 'data'
        const params = functionMatch[1].trim();
        if (params !== "data") {
            throw new Error("Function 'mystrategy' must have exactly one parameter named 'data'." + errorHelper);
        }
    }

    // Check 4: Ensure the function 'mystrategy' returns 'data'
    const returnRegex = /return\s+data\b/;
    if (!returnRegex.test(codeToDisplay)) {
        throw new Error("Function 'mystrategy' must return 'data'." + errorHelper);
    }

}

export default validatePythonCode;