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
      "https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.JUDGE_API_KEY_RAPID_API as string,
        "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: 31, // Python for ML (base image)
        source_code: Buffer.from(this.code).toString("base64"), // Encode source code
        cpu_time_limit: 59, // this.timeout,
        wall_time_limit: 89, // this.timeout,
        memory_limit: this.memoryLimit, // increase to 1GB
        max_processes_and_or_threads: this.maxThreads,
      }),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      // TODO, put in better error message after processing response.json()
      throw new HttpError(
        503,
        `Code Execution Failed:\n\nStatus ${response.status} - ${response.statusText}`,
      );
    }

    const fullResult = await response.json();
    let { stdout, stderr, message, memory, wall_time, time, status } =
      fullResult as Judge0Result;
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
        "utf-8",
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
        stderr += `\n\n⏱️  Tip: Execution time of ${time}s exceeded the limit of ${this.timeout}s. You can increase this in the advanced options. Do note we are currently experiencing a memory timing issue that cuts off even simple strategies, and we're working on a fix.`;
      }
    }

    if (stderr.length === 0 && stdout.length === 0) {
      throw new HttpError(
        503,
        "Something went wrong. No stdout or stderr generated from that execution. Please try again.",
      );
    }

    return { stdout, stderr };
  }
}

export default CodeExecutor;

export type Judge0Result = {
  source_code: string;
  language_id: number;
  stdin: string | null;
  expected_output: string | null;
  stdout: string | null;
  status_id: number;
  created_at: string; // ISO timestamp
  finished_at: string; // ISO timestamp
  time: string; // CPU time (seconds, as string)
  memory: number; // in KB
  stderr: string | null;
  token: string;
  number_of_runs: number;
  cpu_time_limit: string; // seconds
  cpu_extra_time: string; // seconds
  wall_time_limit: string; // seconds
  memory_limit: number; // KB
  stack_limit: number; // KB
  max_processes_and_or_threads: number;
  enable_per_process_and_thread_time_limit: boolean;
  enable_per_process_and_thread_memory_limit: boolean;
  max_file_size: number; // KB
  compile_output: string | null;
  exit_code: number | null;
  exit_signal: number | null;
  message: string | null; // Base64-encoded
  wall_time: string; // actual runtime in seconds
  compiler_options: string | null;
  command_line_arguments: string | null;
  redirect_stderr_to_stdout: boolean;
  callback_url: string | null;
  additional_files: any[] | null;
  enable_network: boolean;
  post_execution_filesystem: string | null; // Base64 ZIP of filesystem
  status: {
    id: number;
    description: string;
  };
  language: {
    id: number;
    name: string;
  };
};
