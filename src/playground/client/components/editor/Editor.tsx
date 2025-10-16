import { useState, useContext } from "react";
import MonacoEditor from "./MonacoEditor";
import ErrorModal from "../modals/ErrorModal";
import DebugConsole from "./DebugConsole";
import InputForm from "./InputForm";
import { runStrategy, charge, updateStrategy } from "wasp/client/operations";
import validateFormInputs from "../../scripts/validateFormInputs";
import validatePythonCode from "../../scripts/validatePythonCode";
import {
  FormInputProps,
  StatProps,
  StrategyResultProps,
  stdProps,
} from "../../../../shared/sharedTypes";
import { StrategyContext } from "../../EditorPage";
import LongLoadingScreen from "./LongLoadingScreen";

interface EditorProps {
  formInputs: FormInputProps;
  strategyResult: StrategyResultProps | null;
  setStrategyResult: (value: StrategyResultProps | null) => void;
  setResultOpen: (value: boolean) => void;
  setFormInputs: React.Dispatch<React.SetStateAction<FormInputProps>>;
  setStrategyResultIsConnectedTo: (value: string) => void;
  std: stdProps;
  setStd: React.Dispatch<React.SetStateAction<stdProps>>;
  codeToDisplay: string;
  setCodeToDisplay: (value: string) => void;
  setWarningMsg: (value: string | null) => void;
  setStats: (value: StatProps | null) => void;
}

function Editor({
  formInputs,
  strategyResult,
  setStrategyResult,
  setResultOpen,
  setFormInputs,
  setStrategyResultIsConnectedTo,
  std,
  setStd,
  codeToDisplay,
  setCodeToDisplay,
  setWarningMsg,
  setStats,
}: EditorProps) {
  const { selectedStrategy, hasSaved, setHasSaved } =
    useContext(StrategyContext);

  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function run() {
    try {
      setInitialState();
      handlePreRunValidations();

      const { strategyResult, statistics, debugOutput, stderr, warnings } =
        await runStrategy({
          formInputs: formInputs,
          code: codeToDisplay,
        });

      handleDebugOutput(debugOutput, stderr);
      if (stderr && strategyResult.signal.length === 0) return;

      setStrategyResult(strategyResult);
      setStats(statistics);
      setResultOpen(true);
      setStrategyResultIsConnectedTo(selectedStrategy.id);

      if (warnings && warnings.length > 0) {
        setWarningMsg(
          warnings.map((str: string) => `WARNING: ${str}`).join("\n\n")
        );
      }

      setHasSaved(false);
      charge();
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
    }));
  }

  function setUserStdout(value: string): void {
    setStd((prevState: stdProps) => ({
      ...prevState,
      out: value,
    }));
  }

  // Helper Functions
  function setInitialState() {
    // if (!hasSaved && strategyResult) {
    //     throw new Error("Have not saved currently loaded result.")
    // }
    setUserStderr("");
    setUserStdout("");
    setStrategyResult(null);
    setStats(null);
    setErrorModalMessage("");
    setLoading(true);
  }

  function handlePreRunValidations() {
    updateStrategy({ id: selectedStrategy.id, code: codeToDisplay });
    validateFormInputs(formInputs);
    validatePythonCode(codeToDisplay);
  }

  function handleDebugOutput(stdout: string, stderr: string) {
    if (stdout) setUserStdout(stdout);
    if (stderr) setUserStderr(stderr);
  }

  return (
    <>
      <InputForm
        formInputs={formInputs}
        setFormInputs={setFormInputs}
        run={run}
      />

      {loading && <LongLoadingScreen />}

      {errorModalMessage && (
        <ErrorModal
          closeModal={() => setErrorModalMessage("")}
          msg={errorModalMessage}
        />
      )}

      <MonacoEditor
        codeToDisplay={codeToDisplay}
        setCodeToDisplay={setCodeToDisplay}
      />

      {(std.out || std.err) && (
        <DebugConsole userStdout={std.out} userStderr={std.err} />
      )}
    </>
  );
}

export default Editor;
