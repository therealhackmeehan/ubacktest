import { useState } from "react";
import { FaTerminal } from "react-icons/fa";

interface DebugConsoleProps {
  userStdout: string;
  userStderr: string;
}

function DebugConsole({ userStdout, userStderr }: DebugConsoleProps) {
  const [isMaximized, setIsMaximized] = useState<boolean>(true);

  return (
    <div className="z-10 w-full shadow-xl p-0.5 bottom-0 left-0 fixed overflow-auto bg-gray-50 text-xs dark:bg-boxdark-2 dark:text-white border-t-2 border-slate-300 dark:border-0">
      <div className="flex justify-center items-center gap-1">
        <FaTerminal /> Output Console
        <button
          className="py-0.5 px-4 m-1 bg-slate-400 hover:bg-slate-500 rounded-lg text-xs text-white"
          onClick={() => setIsMaximized(!isMaximized)}
        >
          show {isMaximized ? " less" : " more"}
        </button>
      </div>
      {isMaximized && (
        <pre className="max-h-96 min-h-32 w-full border-0 bg-white rounded-md text-xs text-start font-mono dark:bg-black py-2 px-5 overflow-auto overscroll-contain">
          {userStdout && (
            <span className="text-black dark:text-white">
              {userStdout + "\n"}
            </span>
          )}
          {userStderr && <span className="text-red-500">{userStderr}</span>}
        </pre>
      )}
    </div>
  );
}

export default DebugConsole;
