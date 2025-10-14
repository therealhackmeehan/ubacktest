import { HttpError } from "wasp/server";
import { UserDefinedData } from "../../shared/sharedTypes";

class STDParser {
  private stdout: string;
  private stderr: string;
  private key: string;

  constructor(stdout: string, stderr: string, key: string) {
    this.stdout = stdout;
    this.stderr = stderr;
    this.key = key;
  }

  public parse() {
    const parsedData = STDParser.parsePythonOutput(this.stdout, this.key);
    let signal: number[] = [];
    let userDefinedData: UserDefinedData = {};

    if (parsedData) {
      signal = parsedData.result.signal;
      const expectedLength = signal.length;
      const rawUserDefinedData: UserDefinedData = parsedData.data;

      userDefinedData = Object.fromEntries(
        Object.entries(rawUserDefinedData).filter(
          ([_, value]) =>
            Array.isArray(value) &&
            value.length === expectedLength &&
            value.every((item) => typeof item === "number"),
        ),
      );
    } else if (!parsedData && !this.stderr) {
      throw new HttpError(
        503,
        "No output extracted from the execution engine. This usually means you're printing too much to stdout.",
      );
    }

    this.stdout = STDParser.stripDebugOutput(this.stdout, this.key);
    const lenLim = 10000;
    this.stdout =
      this.stdout.length > lenLim
        ? `${this.stdout.slice(0, lenLim)}... (${
            this.stdout.length - lenLim
          } more characters)`
        : this.stdout;

    return {
      stdout: this.stdout,
      stderr: this.stderr,
      signal: signal,
      userDefinedData: userDefinedData,
    };
  }

  private static parsePythonOutput(stdout: string, uniqueKey: string) {
    const regex = new RegExp(
      `${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`,
      "s",
    );
    const match = stdout.match(regex);
    return match ? JSON.parse(match[1]) : null;
  }

  private static stripDebugOutput(stdout: string, uniqueKey: string) {
    const regex = new RegExp(
      `${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`,
      "s",
    );
    return stdout.replace(regex, "").trim();
  }
}

export default STDParser;
