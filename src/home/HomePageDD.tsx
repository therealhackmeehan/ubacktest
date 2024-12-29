import { useState } from "react";
import { type Strategy } from "wasp/entities"
import { routes } from 'wasp/client/router';
import RenameModal from "../playground/client/components/Modals/RenameModal";
import DeleteModal from "../playground/client/components/Modals/DeleteModal";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { FaRegEdit, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Editor } from "@monaco-editor/react";
import { useInView } from "react-intersection-observer";

export function StrategyDropDown({ strategy }: { strategy: Strategy }) {

    const { ref, inView } = useInView({
        threshold: .1,
    });

    // keep track of each dropdown's expansion
    const [isExpanded, setIsExpanded] = useState(false);

    // keep track of modal states
    const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    // send latest info to local storage in case user clicks go to strategy
    const handleToLocalStorage = async (id: string) => {
        try {
            localStorage.setItem('projectToLoad', id);
        } catch (error) {
            console.log(error);
        } finally {
            window.location.href = routes.PlaygroundRoute.build();
        }
    }

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

    return (
        <li key={strategy.id} ref={ref}
            className={`border-t-2 border-gray-100 p-3 transition-all duration-[500ms] ${inView
                ? "translate-x-0"
                : "opacity-0 blur-lg -translate-x-[2%]"}`} >
            <div className='flex justify-between'>
                <div className='flex gap-x-2 items-center'>
                    <div className="hover:cursor-pointer hover:text-gray-500"
                        onClick={() => {
                            setIsExpanded(!isExpanded)
                        }}>
                        {isExpanded ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}
                    </div>
                    <div className='font-bold tracking-tight text-gray-900 hover:text-gray-500 hover:cursor-pointer'
                        onClick={() => {
                            setIsExpanded(!isExpanded)
                        }}>
                        {strategy.name}
                    </div>
                </div>
                <div className='flex items-end'>
                    <button className='pl-3 hover:text-slate-500' title='Rename Strategy'
                        onClick={() => setIsRenameModalOpen(true)}>
                        <MdOutlineEdit size='1.4rem' />
                    </button>

                    {isRenameModalOpen && <RenameModal
                        onSuccess={() => setIsRenameModalOpen(false)}
                        closeModal={() => setIsRenameModalOpen(false)}
                        id={strategy.id}
                        currName={strategy.name} />}

                    <button className='hover:text-slate-500 px-1' title='Delete Strategy'
                        onClick={() => setIsDeleteModalOpen(true)}>
                        <MdDeleteOutline size='1.2rem' />
                    </button>

                    {isDeleteModalOpen && <DeleteModal
                        onSuccess={() => setIsDeleteModalOpen(false)}
                        closeModal={() => setIsDeleteModalOpen(false)}
                        id={strategy.id} />}

                    <div className='font-light text-slate-400 text-xs dark:text-white px-2'>
                        created {strategy.createdAt.toLocaleDateString()}
                    </div>
                    <div className='font-light text-gray-700 text-sm dark:text-white px-2'>
                        last updated {strategy.updatedAt.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {isExpanded &&
                <div className="m-3">
                    <Editor
                        className="invert hue-rotate-180"
                        options={miniEditorOpts}
                        height="23vh"
                        defaultLanguage='python'
                        theme="vs-dark"
                        value={strategy.code}
                        loading={(<div className="text-white font-2xl tracking-tight">Loading...</div>)}
                    />
                    <button className='w-full flex justify-center gap-x-2 p-1 my-2 text-sm rounded-md bg-slate-100 hover:bg-slate-200 duration-700'
                        onClick={() => handleToLocalStorage(strategy.id)}>
                        <FaRegEdit /> edit this strategy in the editor
                    </button>
                </div>
            }
        </li>
    )
}