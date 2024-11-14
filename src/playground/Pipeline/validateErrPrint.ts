function validateErrPrint({ err }: { err: string }) {
    // Base message
    let message = err;

    // Check if 'main.py' exists in stderr
    if (err.includes('main.py')) {
        message = 'Note: Errors related to "main.py" may be disregarded, as it serves as the processing function orchestrating the test.\n' + message;
    }

    return message;
}

export default validateErrPrint;
