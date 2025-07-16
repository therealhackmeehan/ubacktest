import { Editor } from "@monaco-editor/react";
import { FiSave } from "react-icons/fi";
import { updateStrategy } from "wasp/client/operations";
import DownloadButton from "./DownloadButton";
import UploadButton from "./UploadButton";
import ErrorModal from "../modals/ErrorModal";
import { useState, useEffect, useRef, useContext } from "react";
import ExamplesModal from "../modals/ExamplesModal";
import { MdLaunch } from "react-icons/md";
import { StrategyContext } from "../../EditorPage";
import { BsQuestionOctagon } from "react-icons/bs";
import PackagesModal from "../modals/PackagesModal";

const editorOpts = {
    minimap: {
        enabled: false
    },
    lineHeight: 18,
    fontSize: 11,
    padding: {
        top: 12,
        bottom: 10
    },
    automaticLayout: true,
}

interface MonacoEditorProps {
    codeToDisplay: string;
    setCodeToDisplay: (value: string) => void;
}

function MonacoEditor({ codeToDisplay, setCodeToDisplay }: MonacoEditorProps) {

    const { selectedStrategy } = useContext(StrategyContext);

    const [errMsg, setErrMsg] = useState<string>('');
    const [buttonText, setButtonText] = useState<string>('save');
    const [saving, setSaving] = useState<boolean>(false);

    const [examplesModalOpen, setExamplesModalOpen] = useState<boolean>(false);
    const [packagesModalOpen, setPackagesModalOpen] = useState<boolean>(false);

    const isSavingRef = useRef(false); // Use a ref to track the saving state

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCodeToDisplay(value);
        }
    };

    const saveCodeToDB = async () => {
        if (isSavingRef.current) return; // Block if already saving
        isSavingRef.current = true; // Mark as saving
        setButtonText("saving...");
        setSaving(true);

        try {
            await updateStrategy({ id: selectedStrategy.id, code: codeToDisplay });
            console.log("saved!");

            // Text animation effect
            const textSequence = [
                "sav",
                "sa",
                "s",
                "sa",
                "sav",
                "save",
                "saved",
                "saved.",
                "saved..",
                "saved...",
                "saved..",
                "saved.",
                "saved"
            ];
            textSequence.forEach((text, index) => {
                setTimeout(() => setButtonText(text), index * 100);
            });

            // Reset the button state after the animation
            setTimeout(() => {
                setButtonText("save");
                setSaving(false);
                isSavingRef.current = false; // Reset the saving flag
            }, 2000);
        } catch (err: any) {
            setErrMsg("Error in attempting to save code to the database.");
            setButtonText("save");
            setSaving(false);
            isSavingRef.current = false; // Ensure flag resets on error
        }
    };

    // Listen for Ctrl+S and call saveCodeToDB
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveCodeToDB();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [codeToDisplay]); // Reattach listener if `code` changes

    function onSuccess(code: string) {
        setCodeToDisplay(code);
        setExamplesModalOpen(false);
    }

    return (
        <>
            {errMsg && <ErrorModal msg={errMsg} closeModal={() => setErrMsg('')} />}

            <div className="md:flex text-xs justify-start border-b-2 dark:border-0 border-black text-gray-800">
                <button
                    disabled={saving}
                    type='button'
                    onClick={saveCodeToDB} // Keep the existing button functionality
                    className="flex px-3 py-1 items-center text-center tracking-tight hover:bg-slate-100 duration-300 dark:text-white dark:hover:text-slate-700"
                >
                    <FiSave size='1.2rem' className="pr-1" /> {buttonText}
                </button>
                <DownloadButton code={codeToDisplay} />
                <UploadButton setCode={setCodeToDisplay} />
                <button className='md:border-l-2 border-black dark:border-0 flex gap-x-1 px-3 py-1 hover:bg-slate-100 items-center text-center tracking-tight duration-300 dark:text-white dark:hover:text-slate-700'
                    onClick={() => setPackagesModalOpen(true)}>
                    <MdLaunch />Included Packages
                </button>
                <button className='md:border-l-2 border-black dark:border-0 flex gap-x-1 px-3 py-1 hover:bg-slate-100 items-center text-center tracking-tight duration-300 dark:text-white dark:hover:text-slate-700'
                    onClick={() => setExamplesModalOpen(true)}>
                    <BsQuestionOctagon />Examples
                </button>
            </div>
            <Editor className="invert dark:invert-0 hue-rotate-180"
                defaultLanguage='python'
                theme="vs-dark"
                value={codeToDisplay}
                onChange={handleEditorChange}
                options={editorOpts}
                loading={(<div className="text-white font-2xl tracking-tight animate-bounce">Loading...</div>)} />
            {packagesModalOpen &&
                <PackagesModal closeModal={() => setPackagesModalOpen(false)} />
            }
            {examplesModalOpen &&
                <ExamplesModal onSuccess={onSuccess} closeModal={() => setExamplesModalOpen(false)} />
            }
        </>
    )
}

export default MonacoEditor;