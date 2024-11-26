import { Editor } from "@monaco-editor/react";
import { FaChevronDown } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { FiDelete } from "react-icons/fi";
import { updateStrategy } from "wasp/client/operations";
import { useState } from "react";

interface MEditorProps {
    code: string;
    setCode: (value: string) => void;
    ID: string;
    userPrint: string;
    errPrint: string;
}

const editorOpts = {
    minimap: {
        enabled: false
    },
    lineHeight: 18,
    fontSize: 11,
    padding: {
        top: 12,
        bottom: 10
    }
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
        <>
            <div className="flex gap-x-4 justify-center border-b-2 border-black">
                <div className="flex text-xs gap-x-2">
                    <button className='flex gap-x-1 p-1 hover:bg-slate-100 hover:font-bold items-center text-center text-gray-800 tracking-tight'>
                        <FaChevronDown />Examples
                    </button>
                    <button className='flex gap-x-1 p-1 hover:bg-slate-100 hover:font-bold items-center text-center text-gray-800 tracking-tight'>
                        <FaChevronDown />Ask AI for Help
                    </button>
                    <button className='flex gap-x-1 p-1 hover:bg-slate-100 hover:font-bold items-center text-center text-gray-800 tracking-tight'>
                        <FaChevronDown />Libraries Included
                    </button>
                </div>
                <button
                    type='button'
                    onClick={saveCodeToDB} // Keep the existing button functionality
                    className='flex p-1 hover:bg-slate-100 hover:font-bold text-center text-gray-800 tracking-tight'
                >
                    <FiSave size='1.6rem' className="pr-2" /> save
                </button>
            </div>
            <Editor className="invert" height="86vh" defaultLanguage='python' theme="vs-dark" value={code} onChange={handleEditorChange} options={editorOpts}
                loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)} />
            {(userPrint || errPrint) &&
                <div className="z-40 p-4 m-4 fixed bottom-0 rounded-lg overflow-auto text-sm tracking-tight border-2 bg-gray-50">
                    Output Console
                    <div className="border-b border-2 mb-2"></div>
                    <div className="gap-x-3 grid grid-cols-4">
                        {userPrint &&
                            <div className="col-span-1">
                                <div className="text-end tracking-tight font-bold text-xs/4">Debug Output</div>
                                <textarea rows={7} className="max-h-96 w-full border-0 bg-white rounded-md text-xs/4 font-mono" readOnly={true} value={userPrint}></textarea>
                            </div>
                        }
                        {errPrint &&
                            <div className="col-span-3">
                                <div className="text-end tracking-tight font-bold text-xs/4">Error Output</div>
                                <textarea rows={7} className="max-h-96 w-full border-0 bg-white rounded-md text-xs/4 text-red-500 font-mono" readOnly={true} value={errPrint}></textarea>
                            </div>
                        }
                    </div>
                </div>}
        </>

    )
}

export default MonacoEditor;