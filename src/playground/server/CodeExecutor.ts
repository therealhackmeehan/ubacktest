import { HttpError } from "wasp/server";
import { Buffer } from 'buffer';

class CodeExecutor {

    private code: string;
    private timeout: number;

    constructor(code: string, timeout: number) {
        this.code = code;
        this.timeout = timeout
    }

    public async execute() {

        const { stdout, stderr } = await CodeExecutor.sendToJudge(this.code, this.timeout);

        return {
            stdout_raw: stdout,
            stderr_raw: stderr,
        }
    }

    private static async sendToJudge(mainFileContent: string, timeout: number) {

        const url = 'https://judge0-extra-ce.p.sulu.sh/submissions?base64_encoded=true&wait=true';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.JUDGE_APIKEY_SULU}`
            },
            body: JSON.stringify({
                language_id: 31, // Python for ML (base image)
                source_code: Buffer.from(mainFileContent).toString('base64'), // Encode source code
                wall_time_limit: timeout,
                cpu_time_limit: timeout,
            })
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new HttpError(503, `Code Execution Failed:\n\n"${response.statusText}"`)
        }

        const fullResult = await response.json();

        let { stdout, stderr } = fullResult;
        if (!stdout) { stdout = '' } else { stdout = Buffer.from(stdout, 'base64').toString('utf-8') };
        if (!stderr) { stderr = '' } else { stderr = Buffer.from(stderr, 'base64').toString('utf-8') };

        if (fullResult.message) {
            stderr = stderr + `"${Buffer.from(fullResult.message, 'base64').toString('utf-8')}"`;
        }

        if (stderr.length === 0 && stdout.length === 0) {
            throw new HttpError(503, 'Something went wrong. No stdout or stderr generated from that execution. Please try again.')
        }

        return { stdout, stderr };
    }

}

export default CodeExecutor;