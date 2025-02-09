import { useQuery, getShared, acceptShare } from "wasp/client/operations";
import LoadingScreen from "../../../client/components/LoadingScreen";
import { useState } from "react";
import { ResultHeader } from "./ResultListItem";
import { FiBookOpen } from "react-icons/fi";
import OpenResult from "./OpenResult";
import { FormInputProps } from "../../../shared/sharedTypes";
import { GetSharedProps } from "../../server/shareOperations";
import { BiTrash } from "react-icons/bi";
import DeleteShareModal from "./modals/DeleteShareModal";

function SharedWithMe() {

    const [showAll, setShowAll] = useState(false);
    const toggleShowAll = () => setShowAll((prev) => !prev);
    const { data: results, isLoading: isResultsLoading } = useQuery(getShared);
    const [resultPanelOpen, setResultPanelOpen] = useState<boolean>(false);
    const [deleteSharedModalOpen, setDeleteSharedModalOpen] = useState<boolean>(false);

    if (isResultsLoading) return <LoadingScreen />;

    return (
        <div className="m-3 p-2 rounded-lg bg-slate-100 shadow-lg">
            {(!isResultsLoading && results && results.length > 0) ? (
                <>
                    <ul>
                        {(showAll ? results : results.slice(0, 10)).map((result: GetSharedProps) => (
                            <li key={result.sharedID}>
                                {result.accepted ? (
                                    <div className="rounded-lg bg-white border-2 border-slate-500 items-center my-3 mx-1 px-2 flex justify-between">
                                        <ResultHeader result={result} setResultPanelOpen={setResultPanelOpen} />
                                        <div className="flex gap-x-2 justify-between">
                                            <div className="text-xs p-2 m-1">
                                                from @{result.email?.split('@')[0] ?? "unknown"}
                                            </div>
                                            <button
                                                className="hover:rotate-180 p-1 duration-500"
                                                onClick={() => setDeleteSharedModalOpen(true)}
                                            >
                                                <BiTrash />
                                            </button>
                                            <button
                                                className="px-3 py-1 flex rounded-lg bg-slate-100 m-1 hover:shadow-lg items-center gap-x-2"
                                                onClick={() => setResultPanelOpen(true)}
                                            >
                                                View
                                                <FiBookOpen />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between gap-x-2">
                                        <div className="font-light tracking-tight">@{result.email?.split('@')[0] ?? "unknown"} sent you a result.</div>
                                        <div className="flex justify-between gap-x-2 p-1">
                                            <button
                                                className="bg-sky-700 rounded-lg text-xs font-bold text-white p-1"
                                                onClick={() => acceptShare({ id: result.sharedID })}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="bg-white rounded-lg text-xs border-2 font-bold border-red-900 text-red-900 p-1"
                                                onClick={() => setDeleteSharedModalOpen(true)}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Conditionally render modals only when needed */}
                                {deleteSharedModalOpen && (
                                    <DeleteShareModal closeModal={() => setDeleteSharedModalOpen(false)} id={result.sharedID} />
                                )}

                                {resultPanelOpen && (
                                    <OpenResult
                                        formInputs={result.formInputs as unknown as FormInputProps}
                                        setResultPanelOpen={setResultPanelOpen}
                                        result={result}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>

                    {results.length > 10 && (
                        <button
                            onClick={toggleShowAll}
                            className="w-full px-2 py-1 rounded-md bg-slate-100 border-2 border-slate-500 hover:shadow hover:bg-slate-200 hover:italic duration-700"
                        >
                            {showAll ? "Show Less" : "See All"}
                        </button>
                    )}
                </>
            ) : (
                <div className="text-center">
                    No results found. If someone were to share a result with you, it would appear here.
                </div>
            )}
        </div>
    )
}

export default SharedWithMe;