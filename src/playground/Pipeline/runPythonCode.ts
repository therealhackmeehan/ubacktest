interface DataProps {
    data: any;
    code: string;
}

function generateRandomKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function runPythonCode({ data, code }: DataProps) {
    // Generate a unique key to mark the output
    const uniqueKey = generateRandomKey();
    const mainFile = `
  from strategy import mystrategy
  import json
  import pandas as pd
  
  # Parse input data and format as DataFrame
  jsonCodeUnformatted = '${JSON.stringify(data)}'
  jsonCodeFormatted = json.loads(jsonCodeUnformatted)
  df = pd.DataFrame(jsonCodeFormatted)
  
  # Execute strategy and get signal result
  signalResult = mystrategy(df)
  signalResult = signalResult['signal']
  
  # Print the result with a unique delimiter for easy extraction
  print("${uniqueKey}START${uniqueKey}" + str(signalResult.to_json(orient='values')) + "${uniqueKey}END${uniqueKey}")
  `;

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language: "python",
            version: "3.10.0",
            files: [
                {
                    name: "main.py",
                    content: mainFile
                },
                {
                    name: "mystrategy.py",
                    content: code
                },
            ],
        })
    });

    const result = await response.json();
    const output = result.run.output;
    if (output.run.signal == "SIGKILL") {
        throw new Error("SIGKILL");
    }

    const stderr = output.run.stderr;

    // Use the unique key to create a regex for extracting the output within the keys
    const regex = new RegExp(`${uniqueKey}START${uniqueKey}(.*?)${uniqueKey}END${uniqueKey}`, "s");
    const mainResultMatch = output.match(regex);
    const mainResult = mainResultMatch ? mainResultMatch[1] : null;

    // Capture all other output outside the delimiters by removing the matched result from the original output
    const otherOutput = output.replace(regex, "").trim();

    if (!mainResult) {
        throw new Error("No valid output found between delimiters.");
    }

    // Parse the extracted main JSON data
    const parsedData = JSON.parse(mainResult);

    return { mainResult: parsedData, 
             userStdout: otherOutput,
             stderr: stderr};
}

export default runPythonCode;
