import { HttpError } from "wasp/server";
import main_py from "./main_py";

interface DataProps {
    data: any;
    code: string;
}

function generateRandomKey(): string {
    return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
}


async function runPythonCode({ data, code }: DataProps) {
    // Generate unique markers for parsing the output
    const uniqueKey = generateRandomKey();
    const mainFileContent = main_py({ data, uniqueKey, colToTest: 'close' });

    // Prepare the request payload
    const payload = {
        language: "python",
        version: "3.10.0",
        files: [
            { name: "main.py", content: mainFileContent },
            { name: "strategy.py", content: code },
        ],
    };

    // Make the API call to execute the Python code
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // Parse the response
    const { run } = await response.json();
    console.log(run);
    const { stderr = '', stdout = '', signal } = run;

    // Handle resource-limit termination
    if (signal === "SIGKILL" && !stderr && !stdout) {
        throw new HttpError(
            500,
            "SIGKILL: Your program was terminated because it exceeded resource limits."
        );
    }

    // Append warning if `main.py` errors are present
    const updatedStderr = stderr.includes('main.py')
        ? `${stderr}\n\nNote: Errors related to "main.py" may be disregarded, as it serves as the processing function orchestrating the test.`
        : stderr;

    // Extract data from the Python output
    const parsedData = parsePythonOutput(stdout, uniqueKey);

    // Update `data` with results or reset to null
    if (parsedData) Object.assign(data, parsedData);

    return {
        data,
        debugOutput: parsedData ? stripDebugOutput(stdout, uniqueKey) : stdout,
        stderr: updatedStderr,
    };
}

// Helper Functions
function parsePythonOutput(stdout: string, uniqueKey: string) {
    const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
    const match = stdout.match(regex);
    return match ? JSON.parse(match[1]) : null;
}

function stripDebugOutput(stdout: string, uniqueKey: string) {
    const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
    return stdout.replace(regex, '').trim();
}

export default runPythonCode;