import { useState } from "react"
import MonacoEditor from "./MonacoEditor";
import ErrorModal from "../Modals/ErrorModal";
import DebugConsole from "./DebugConsole";
import InputForm from "./InputForm";
import { runStrategy, charge, updateStrategy } from "wasp/client/operations";
import validateFormInputs from "../../scripts/validateFormInputs";
import validatePythonCode from "../../scripts/validatePythonCode";
import { FormInputProps } from "../../../../shared/sharedTypes";
import { type stdProps } from "./Dashboard";
import LoadingScreen from "./LoadingScreen";

interface EditorProps {
    codeToDisplay: string;
    selectedStrategy: string;
    formInputs: FormInputProps;
    setCodeToDisplay: (value: string) => void;
    setResult: (value: any) => void;
    setResultOpen: (value: boolean) => void;
    setFormInputs: (value: any) => void;
    setStrategyResultIsConnectedTo: (value: string) => void;
    std: stdProps;
    setStd: (value: any) => void;
}

function Editor({ codeToDisplay, selectedStrategy, formInputs, setCodeToDisplay, setResult, setResultOpen, setFormInputs, setStrategyResultIsConnectedTo, std, setStd }: EditorProps) {

    const [errorModalMessage, setErrorModalMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function run() {
        setInitialState();

        try {
            handlePreRunValidations();

            const { data, debugOutput, stderr } = await runStrategy({ formInputs: formInputs, code: codeToDisplay });
            handleDebugOutput(debugOutput, stderr);

            const existsData = // should be sufficient check to continue forward
                data.portfolio.length > 0 && 
                data.portfolioWithCosts.length > 0 && 
                data.signal.length > 0 && 
                data.returns.length > 0;

            if (existsData) {
                setResult(data);
                setResultOpen(true);
                setStrategyResultIsConnectedTo(selectedStrategy);
                charge(); // Deduct a credit
            } else if (!stderr) {
                throw new Error('Something went wrong. No stderr was reported but also no data was returned.');
            }
        } catch (error: any) {
            setErrorModalMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    function setUserStderr(value: string): void {
        setStd((prevState: stdProps) => ({
            ...prevState,
            err: value,
        }))
    };

    function setUserStdout(value: string): void {
        setStd((prevState: stdProps) => ({
            ...prevState,
            out: value,
        }))
    };

    // Helper Functions
    function setInitialState() {
        setUserStderr('');
        setUserStdout('');
        setResult(null);
        setErrorModalMessage('');
        setLoading(true);
    }

    function handlePreRunValidations() {
        updateStrategy({ id: selectedStrategy, code: codeToDisplay });
        validateFormInputs({ formInputs });
        validatePythonCode({ code: codeToDisplay });
    }

    function handleDebugOutput(debugOutput: string, stderr: string) {
        if (debugOutput) setUserStdout(debugOutput);
        if (stderr) setUserStderr(stderr);
    }

    return (
        <>

            <InputForm formInputs={formInputs} setFormInputs={setFormInputs} run={run} />

            {loading && <LoadingScreen />}

            {errorModalMessage && <ErrorModal onClose={() => setErrorModalMessage('')} msg={errorModalMessage} />}

            <MonacoEditor
                code={codeToDisplay}
                setCode={setCodeToDisplay}
                ID={selectedStrategy}
            />

            <DebugConsole userStdout={std.out} userStderr={std.err} />

        </>
    )
}


export default Editor;