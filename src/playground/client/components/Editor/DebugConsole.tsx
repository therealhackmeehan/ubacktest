import { useState } from "react";

interface DebugConsoleProps {
    userStdout: string;
    userStderr: string;
}

function DebugConsole({ userStdout, userStderr }: DebugConsoleProps) {

    const [isMaximized, setIsMaximized] = useState<boolean>(true);

    return (
        <>
            {(userStdout || userStderr) &&
                <div className="z-10 p-4 m-4 resize-x max-w-5xl min-w-2 bottom-0 rounded-lg fixed overflow-auto border-2 bg-gray-50 text-sm tracking-tight">
                    Output Console
                    <button className="p-1 m-2 bg-slate-400 hover:bg-slate-500 rounded-lg text-xs text-white"
                        onClick={() => setIsMaximized(!isMaximized)}>
                        show
                        {isMaximized ? ' less' : ' more'}
                    </button>
                    <div className="border-b border-2 mb-2"></div>
                    <div className="gap-x-3 grid grid-cols-4">
                        {isMaximized &&
                            <>
                                <div className="col-span-2">
                                    <div className="text-end tracking-tight font-bold text-xs">Debug Output</div>
                                    <textarea rows={7} cols={50} className="max-h-96 w-full border-0 bg-white rounded-md text-xs/4 font-mono" readOnly={true} value={userStdout}></textarea>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-end tracking-tight font-bold text-xs">Error Output</div>
                                    <textarea rows={7} cols={50} className="max-h-96 w-full border-0 bg-white rounded-md text-xs/4 text-red-500 font-mono" readOnly={true} value={userStderr}></textarea>
                                </div>
                            </>
                        }
                    </div>
                </div>}
        </>)
}

export default DebugConsole;