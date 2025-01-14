import { useState, useContext, useEffect } from "react"
import MonacoEditor from "./MonacoEditor";
import ErrorModal from "../modals/ErrorModal";
import DebugConsole from "./DebugConsole";
import InputForm from "./InputForm";
import { runStrategy, charge, updateStrategy } from "wasp/client/operations";
import validateFormInputs from "../../scripts/validateFormInputs";
import validatePythonCode from "../../scripts/validatePythonCode";
import { FormInputProps, StrategyResultProps } from "../../../../shared/sharedTypes";
import { type stdProps } from "../StrategyEditor";
import LoadingScreen from "../../../../client/components/LoadingScreen";
import { StrategyContext } from "../../EditorPage";

interface EditorProps {
    formInputs: FormInputProps;
    setStrategyResult: (value: StrategyResultProps | null) => void;
    setResultOpen: (value: boolean) => void;
    setFormInputs: (value: any) => void;
    setStrategyResultIsConnectedTo: (value: string) => void;
    std: stdProps;
    setStd: (value: any) => void;
}

function Editor({ formInputs, setStrategyResult, setResultOpen, setFormInputs, setStrategyResultIsConnectedTo, std, setStd }: EditorProps) {

    const { selectedStrategy } = useContext(StrategyContext);
    const [codeToDisplay, setCodeToDisplay] = useState<string>(selectedStrategy.code);

    useEffect(() => {
        if (selectedStrategy) {
            setCodeToDisplay(selectedStrategy.code);
        }
    }, [selectedStrategy]);

    const [errorModalMessage, setErrorModalMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function run() {
        setInitialState();

        try {
            handlePreRunValidations();

            const {
                strategyResult,
                debugOutput,
                stderr,
                warning
            } = await runStrategy({ formInputs: formInputs, code: codeToDisplay });

            handleDebugOutput(debugOutput, stderr);
            if (stderr) return;

            const existsData = // should be sufficient check to continue forward
                strategyResult.portfolio.length > 0 &&
                strategyResult.portfolioWithCosts.length > 0 &&
                strategyResult.signal.length > 0 &&
                strategyResult.returns.length > 0;

            if (existsData) {
                setStrategyResult(strategyResult);
                setResultOpen(true);
                setStrategyResultIsConnectedTo(selectedStrategy.id);
                charge(); // Deduct a credit
            } else {
                throw new Error("Something went wrong.");
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
        setStrategyResult(null);
        setErrorModalMessage('');
        setLoading(true);
    }

    function handlePreRunValidations() {
        updateStrategy({ id: selectedStrategy.id, code: codeToDisplay });
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

            {errorModalMessage && <ErrorModal closeModal={() => setErrorModalMessage('')} msg={errorModalMessage} />}

            <MonacoEditor codeToDisplay={codeToDisplay} setCodeToDisplay={setCodeToDisplay} />

            <DebugConsole userStdout={std.out} userStderr={std.err} />

        </>
    )
}


export default Editor;