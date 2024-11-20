function validateErrPrint({ err }: { err: string }) {

    if (!err) {
        return;
    }
    
    // Base message
    let message = err;

    // Check if 'main.py' exists in stderr
    if (err.includes('main.py')) {
        message = message + `\n\n\nNote: Errors related to "main.py" may be disregarded, as it serves as the processing function orchestrating the test.`;
    }

    return message;
}

export default validateErrPrint;
