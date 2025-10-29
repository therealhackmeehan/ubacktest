import { HttpError } from "wasp/server";
import { Buffer } from "buffer";

class CodeExecutor {
  private code: string;
  private timeout: number;
  private readonly memoryLimit: number = 1024000;
  private readonly maxThreads: number = 256;

  constructor(code: string, timeout: number) {
    this.code = code;
    this.timeout = timeout;
  }

  public async execute() {
    const { stdout, stderr } = await this.sendToJudge();
    return {
      stdout_raw: stdout,
      stderr_raw: stderr,
    };
  }

  private async sendToJudge() {
    const url =
      "https://judge0-extra-ce.p.sulu.sh/submissions?base64_encoded=true&wait=true";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.JUDGE_API_KEY_SULU}`,
      },
      body: JSON.stringify({
        language_id: 31, // Python for ML (base image)
        source_code: Buffer.from(this.code).toString("base64"), // Encode source code
        wall_time_limit: this.timeout,
        cpu_time_limit: this.timeout,
        memory_limit: this.memoryLimit, // increase to 1GB
        max_processes_and_or_threads: this.maxThreads,
      }),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new HttpError(
        503,
        `Code Execution Failed:\n\nStatus ${response.status}: "${response.statusText}"`
      );
    }

    const fullResult = await response.json();

    //FIX THIS!! Any typing
    let { stdout, stderr, message, memory, time, status } = fullResult;
    const { id, description } = status;

    // for some reason this doesn't work unless I set the null values to '' (???)
    if (!stdout) {
      stdout = "";
    } else {
      stdout = Buffer.from(stdout, "base64").toString("utf-8");
    }
    if (!stderr) {
      stderr = "";
    } else {
      stderr = Buffer.from(stderr, "base64").toString("utf-8");
    }

    if (message) {
      const decodedMessage = Buffer.from(fullResult.message, "base64").toString(
        "utf-8"
      );
      const delim = "\n════════════════ Diagnostics ════════════════";

      stderr += `\n${decodedMessage.trim()}.\n`;

      if (memory && time) {
        stderr += `${delim}
Memory Usage : ${memory} KB
Time Elapsed : ${time} s
Message      : ${description}`;
      }

      if (memory >= this.memoryLimit) {
        stderr += `\n\n⚠️  Note: Memory usage exceeded the 1GB limit.`;
      }

      if (parseFloat(time) > this.timeout) {
        stderr += `\n\n⏱️  Tip: Execution time of ${time}s exceeded the limit of ${this.timeout}s. You can increase this in the advanced options.`;
      }
    }

    if (stderr.length === 0 && stdout.length === 0) {
      throw new HttpError(
        503,
        "Something went wrong. No stdout or stderr generated from that execution. Please try again."
      );
    }

    return { stdout, stderr };
  }
}

export default CodeExecutor;
