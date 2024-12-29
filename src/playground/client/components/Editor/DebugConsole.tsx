import { useState } from "react";

interface DebugConsoleProps {
    userStdout: string;
    userStderr: string;
}

function DebugConsole({ userStdout, userStderr }: DebugConsoleProps) {

    const [isMaximized, setIsMaximized] = useState<boolean>(false);

    return (
        <>
            {(userStdout || userStderr) &&
                <div className="z-40 p-4 m-4 resize-x max-w-5xl min-w-2 absolute bottom-0 rounded-lg overflow-auto text-sm tracking-tight border-2 bg-gray-50">

                    Output Console
                    <div className="border-b border-2 mb-2"></div>
                    <div className="gap-x-3 grid grid-cols-4">
                        <button className="p-2 bg-black text-white"
                            onClick={() => setIsMaximized(!isMaximized)}>
                            show
                            {isMaximized ? 'less' : 'more'}
                        </button>
                        {isMaximized &&
                            <>
                                <div className="col-span-2">
                                    <div className="text-end tracking-tight font-bold text-xs/4">Debug Output</div>
                                    <textarea rows={7} cols={50} className="max-h-96 w-full border-0 bg-white rounded-md text-xs/4 font-mono" readOnly={true} value={userStdout}></textarea>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-end tracking-tight font-bold text-xs/4">Error Output</div>
                                    <textarea rows={7} cols={50} className="max-h-96 w-full border-0 bg-white rounded-md text-xs/4 text-red-500 font-mono" readOnly={true} value={userStderr}></textarea>
                                </div>
                            </>
                        }
                    </div>
                </div>}
        </>)
}

export default DebugConsole;