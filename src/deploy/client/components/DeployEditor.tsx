import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import WarningModal from "./WarningModal";
import { runCodeGeneration } from "wasp/client/operations";

export default function DeployEditor({ codeToDisplay }: { codeToDisplay: string }) {

    const [warningModalOpen, setWarningModalOpen] = useState<boolean>(false);

    const miniEditorOpts = {
        readOnly: true,
        domReadOnly: true,
        selectionHighlight: false,
        lineHeight: 18,
        fontSize: 11,
        padding: {
            top: 12,
            bottom: 0
        }
    }

    if (!codeToDisplay) {
        return (
            <div className="col-span-10 h-full">
                <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">
                    Select/Create a Strategy to Get Started.
                </div>
            </div>
        )
    }

    async function testDeploy() {
        console.log('about to run code gen')
        const c = await runCodeGeneration(codeToDisplay);
        console.log(c)
    }

    return (
        <div className="col-span-10 h-full overflow-clip group relative">
            <Editor
                className="group-hover:hue-rotate-180 group-hover:rotate-1 duration-700"
                options={miniEditorOpts}
                defaultLanguage='python'
                theme="vs-dark"
                value={codeToDisplay}
                loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)}
            />
            <button className="opacity-0 italic group-hover:opacity-90 duration-700 m-auto absolute inset-0 flex items-center justify-center text-white font-extrabold text-xl tracking-tight"
                onClick={testDeploy}>
                Let's go!
            </button>
            <button className="bg-white text-black m-8"
                onClick={testDeploy}>
                Click here to test
            </button>

            {
                warningModalOpen && < WarningModal closeModal={() => setWarningModalOpen(false)} onConfirm={() => setWarningModalOpen(false)} />
            }
        </div>
    );
}
