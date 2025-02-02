import { useState, useContext } from "react"
import MonacoEditor from "./MonacoEditor";
import ErrorModal from "../modals/ErrorModal";
import DebugConsole from "./DebugConsole";
import InputForm from "./InputForm";
import { runStrategy, charge, uncharge, updateStrategy } from "wasp/client/operations";
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
    codeToDisplay: string;
    setCodeToDisplay: (value: string) => void;
    setWarningMsg: (value: string | null) => void;
}

function Editor({ formInputs, setStrategyResult, setResultOpen, setFormInputs, setStrategyResultIsConnectedTo, std, setStd, codeToDisplay, setCodeToDisplay, setWarningMsg }: EditorProps) {

    const { selectedStrategy } = useContext(StrategyContext);

    const [errorModalMessage, setErrorModalMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function run() {
        setInitialState();

        try {
            handlePreRunValidations();
            charge();

            const { strategyResult, debugOutput, stderr, warnings } =
                await runStrategy({ formInputs: formInputs, code: codeToDisplay });

            handleDebugOutput(debugOutput, stderr);
            if (stderr) return;

            setStrategyResult(strategyResult);
            setResultOpen(true);
            setStrategyResultIsConnectedTo(selectedStrategy.id);

            if (warnings && warnings.length > 0) {
                setWarningMsg(warnings.map((str: string) => `WARNING: ${str}`).join('\n\n'));
            }

        } catch (error: any) {
            uncharge();
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

    function handleDebugOutput(stdout: string, stderr: string) {
        if (stdout) setUserStdout(stdout);
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