import { Editor } from "@monaco-editor/react";
import { FaChevronDown } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { updateStrategy } from "wasp/client/operations";
import DownloadButton from "./DownloadButton";
import UploadButton from "./UploadButton";
import ErrorModal from "../Modals/ErrorModal";
import { useState } from "react";
import ExamplesModal from "../Modals/ExamplesModal";
import { MdLaunch } from "react-icons/md";

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

    const [errMsg, setErrMsg] = useState<string>('');
    const [buttonText, setButtonText] = useState<string>('save');
    const [saving, setSaving] = useState<boolean>(false);

    const [examplesModalOpen, setExamplesModalOpen] = useState<boolean>(false);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    const saveCodeToDB = () => {
        setButtonText("saving...");
        setSaving(true);

        try {
            updateStrategy({ id: ID, code: code }); // Await the database update
            console.log("saved!");

            // Create an array of text changes
            const textSequence = ["sav", "sa", "s", "sa", "sav", "save", "saved", "saved.", "saved..", "saved...", "saved..", "saved.", "saved"];
            textSequence.forEach((text, index) => {
                setTimeout(() => setButtonText(text), index * 100); // Set text with delay
            });

            // Reset the button state after the animation
            setTimeout(() => {
                setButtonText("save");
                setSaving(false);
            }, 2000);
        } catch (err: any) {
            setErrMsg("Error in attempting to save code to the database.");
            setButtonText("save");
            setSaving(false);
        }
    };

    function onSuccess(code: string) {
        setCode(code);
        setExamplesModalOpen(false);
    }

    return (
        <>
            {errMsg && <ErrorModal msg={errMsg} onClose={() => setErrMsg('')} />}

            <div className="flex text-xs justify-start border-b-2 border-black">
                <button
                    disabled={saving}
                    type='button'
                    onClick={saveCodeToDB} // Keep the existing button functionality
                    className="flex px-3 py-1 items-center text-center tracking-tight text-gray-800 hover:bg-slate-100 hover:font-bold"
                >
                    <FiSave size='1.2rem' className="pr-1" /> {buttonText}
                </button>
                <DownloadButton code={code} />
                <UploadButton setCode={setCode} />
                <button className='border-l-2 border-black flex gap-x-1 px-3 py-1 hover:bg-slate-100 hover:font-bold items-center text-center text-gray-800 tracking-tight'
                    onClick={() => setExamplesModalOpen(true)}>
                    <MdLaunch />Examples
                </button>
            </div>
            <Editor className="invert z-0" height="85vh" defaultLanguage='python' theme="vs-dark" value={code} onChange={handleEditorChange} options={editorOpts}
                loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)} />

            {examplesModalOpen &&
                <ExamplesModal onSuccess={onSuccess} closeModal={() => setExamplesModalOpen(false)} />
            }
        </>
    )
}

export default MonacoEditor;