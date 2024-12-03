import { Editor } from "@monaco-editor/react";
import { FaChevronDown } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { updateStrategy } from "wasp/client/operations";

interface MEditorProps {
    code: string;
    setCode: (value: string) => void;
    ID: string;
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

function MonacoEditor({ code, setCode, ID }: MEditorProps) {

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

    return (
        <>
            <div className="flex gap-x-4 px-2 justify-between border-b-2 border-black">
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
                <div className='flex gap-x-2'>
                    <button
                        type='button'
                        onClick={saveCodeToDB} // Keep the existing button functionality
                        className='flex p-1 hover:bg-slate-100 hover:font-bold text-center text-gray-800 tracking-tight'
                    >
                        <FiSave size='1.6rem' className="pr-2" /> save
                    </button>
                    <button
                        type='button'
                        onClick={saveCodeToDB} // Keep the existing button functionality
                        className='flex p-1 hover:bg-slate-100 hover:font-bold text-center text-gray-800 tracking-tight'
                    >
                        <FiSave size='1.6rem' className="pr-2" /> download
                    </button>
                    <button
                        type='button'
                        onClick={saveCodeToDB} // Keep the existing button functionality
                        className='flex p-1 hover:bg-slate-100 hover:font-bold text-center text-gray-800 tracking-tight'
                    >
                        <FiSave size='1.6rem' className="pr-2" /> upload
                    </button>
                </div>
            </div>
            <Editor className="invert" height="85vh" defaultLanguage='python' theme="vs-dark" value={code} onChange={handleEditorChange} options={editorOpts}
                loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)} />
        </>
    )
}

export default MonacoEditor;