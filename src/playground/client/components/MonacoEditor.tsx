import { Editor } from "@monaco-editor/react";
import { FaChevronDown } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { updateStrategy } from "wasp/client/operations";

interface MEditorProps {
    code: string;
    setCode: (value: string) => void;
    ID: string;
    userPrint: string;
    errPrint: string;
}

function MonacoEditor({ code, setCode, ID, userPrint, errPrint }: MEditorProps) {

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    const saveCodeToDB = async () => {
        try {
            await updateStrategy({ id: ID, code: code });
            console.log('saved!');
        } catch (err: any) {
            window.alert('Error: ' + (err.message || 'Something went wrong'));
        }
    };

    window.addEventListener("keydown", async (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
            event.preventDefault();  // Prevent the default save behavior
            console.log("Save Key Pressed")
        }
    });

    return (
        <div className="relative col-span-5">
            <div className="bg-purple-900 rounded-md p-3">
                <div className="flex justify-between pb-2">
                    <div className="flex gap-x-2">
                        <button className='flex gap-x-1 hover:bg-purple-600 items-center rounded-lg p-1 m-1 text-center text-white tracking-tight font-extrabold'>
                            <FaChevronDown />Examples
                        </button>
                        <button className='flex gap-x-1 hover:bg-purple-600 items-center rounded-lg p-1 m-1 text-center text-white tracking-tight font-extrabold'>
                            <FaChevronDown />Ask AI for Help
                        </button>
                        <button className='flex gap-x-1 hover:bg-purple-600 items-center rounded-lg p-1 m-1 text-center text-white tracking-tight font-extrabold'>
                            <FaChevronDown />Libraries Included
                        </button>
                    </div>
                    <button
                        type='button'
                        onClick={saveCodeToDB} // Keep the existing button functionality
                        className='flex rounded-lg p-1 m-1 hover:bg-purple-600 text-center text-white tracking-tight font-light'
                    >
                        <FiSave size='1.6rem' className="pr-2" /> save
                    </button>
                </div>
                <Editor className="invert" height="24vh" defaultLanguage='python' theme="vs-dark" value={code} onChange={handleEditorChange}
                    loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)} />
                {(userPrint || errPrint) &&
                    <div className="p-2 mt-4 rounded-lg text-sm tracking-tight border-2 text-purple-800 bg-white">
                        Output Console
                        <div className="border-b border-2 mb-2"></div>
                        <div className="text-end tracking-tight font-bold text-xs">Debug Output</div>
                        <textarea rows={Math.round(userPrint.length)/25} className="w-full rounded-md text-xs/4 font-mono m-1" readOnly={true} value={userPrint}></textarea>
                        <div className="text-end tracking-tight font-bold text-xs">Error Output</div>
                        <textarea rows={Math.round(errPrint.length)/75} className="w-full rounded-md text-xs/4 text-red-500 font-mono m-1" readOnly={true} value={errPrint}></textarea>
                    </div>}
            </div>
        </div>

    )
}

export default MonacoEditor;