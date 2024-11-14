import validateFormInputs from "./validateFormInputs";
import validatePythonCode from "./validatePythonCode";
import getStockData from "./getStockData";
import validateStockData from "./validateStockData";
import runPythonCode from "./runPythonCode";

interface pipelineProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
    codeToDisplay: string;
}

async function Pipeline({ symbol, startDate, endDate, intval, codeToDisplay }: pipelineProps) {

    validateFormInputs({ symbol, startDate, endDate, intval });
    validatePythonCode({ codeToDisplay });

    const returnedStockData = await getStockData({ symbol, startDate, endDate, intval });
    const data = validateStockData({ returnedStockData });

    const pythonExecutionInfo = await runPythonCode({ data, codeToDisplay });

    const userPrint = pythonExecutionInfo.userStdout;
    const errPrint = pythonExecutionInfo.stderr;

    const pandasPrint = pythonExecutionInfo.mainResult;
    const parsedSignal = JSON.parse(pandasPrint);
    const closes = data.close;

    // build the portfolio value array
    let portfolioValue = closes[0]; // Starting portfolio value (could be any number)
    const dailyValues = [portfolioValue]; // Store cumulative portfolio values over time

    for (let i = 0; i < closes.length - 1; i++) {
        const dailyChange = (closes[i + 1] - closes[i]) / closes[i]; // Next day's percentage change
        const position = parsedSignal[i]; // -1: short, 0: hold, 1: buy on current day's signal

        portfolioValue += portfolioValue * dailyChange * position; // Apply position to next day's change
        dailyValues.push(portfolioValue); // Store updated portfolio value
    }

    data.portfolio = dailyValues;

    const backtestResult = {
        data: data,
        userPrint: userPrint,
        errPrint: errPrint
    }

    return backtestResult;

    // remove a token if applicable
}

export default Pipeline;