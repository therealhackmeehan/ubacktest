import { type Strategy } from "wasp/entities"
import { routes } from 'wasp/client/router';
import { FaRegEdit } from "react-icons/fa";
import { Editor } from "@monaco-editor/react";
import { miniEditorOpts } from "../StrategyPage";

function StrategyPreview({ strategy }: { strategy: Strategy }) {

    const handleToLocalStorage = async (id: string) => {
        try {
            localStorage.setItem('projectToLoad', id);
        } catch (error) {
            console.log(error);
        } finally {
            window.location.href = routes.EditorRoute.build();
        }
    }

    return (
        <div className="my-10 p-4 rounded-lg bg-white dark:bg-boxdark-2">
            <div className="my-2 text-xl tracking-tight font-extrabold text-black dark:text-white">Code <span className="text-sky-600 dark:text-blue-300">Preview</span></div>
            <Editor
                className="invert dark:invert-0 hue-rotate-180"
                options={miniEditorOpts}
                height="40vh"
                defaultLanguage='python'
                theme="vs-dark"
                value={strategy.code || 'No code found for this strategy.'}
                loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)}
            />
            <button className='w-full flex justify-center gap-x-2 p-1 rounded-b-md bg-slate-600 text-white hover:bg-slate-200 hover:text-black duration-700'
                onClick={() => handleToLocalStorage(strategy.id)}>
                <FaRegEdit /> edit this strategy in the editor
            </button>
        </div>
    )
}

export default StrategyPreview;
