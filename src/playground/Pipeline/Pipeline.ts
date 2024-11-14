import validateFormInputs from "./validateFormInputs";
import validatePythonCode from "./validatePythonCode";
import getStockData from "./getStockData";
import validateStockData from "./validateStockData";
import runPythonCode from "./runPythonCode";
import validateErrPrint from "./validateErrPrint";
import validateStrategyResult from "./validateStrategyResult";

interface pipelineProps {
    symbol: string;
    startDate: string;
    endDate: string;
    intval: string;
    code: string;
}

async function Pipeline({ symbol, startDate, endDate, intval, code }: pipelineProps) {

    validateFormInputs({ symbol: symbol, startDate: startDate, endDate: endDate, intval: intval });
    validatePythonCode({ code: code });

    const returnedStockData = await getStockData({ symbol, startDate, endDate, intval });
    const data = validateStockData({ stockData: returnedStockData });

    const pythonExecutionInfo = await runPythonCode({ data, code });

    const userPrint = pythonExecutionInfo.userStdout;
    let errPrint = pythonExecutionInfo.stderr;
    errPrint = validateErrPrint({err: errPrint});

    const pandasPrint = pythonExecutionInfo.mainResult;
    const parsedSignal = JSON.parse(pandasPrint);
    data.signal = parsedSignal;
    const closes = data.close;

    // build the portfolio value array
    let portfolioValue = 1; // Starting portfolio value (could be any number)
    const dailyValues = [portfolioValue]; // Store cumulative portfolio values over time

    for (let i = 0; i < closes.length - 1; i++) {
        const dailyChange = (closes[i + 1] - closes[i]) / closes[i]; // Next day's percentage change
        const position = data.signal[i]; // -1: short, 0: hold, 1: buy on current day's signal

        portfolioValue += portfolioValue * dailyChange * position; // Apply position to next day's change
        dailyValues.push(portfolioValue); // Store updated portfolio value
    }

    data.portfolio = dailyValues;

    validateStrategyResult({data});

    const backtestResult = {
        data: data,
        userPrint: userPrint,
        errPrint: errPrint
    }

    return backtestResult;

    // remove a token if applicable
}

export default Pipeline;