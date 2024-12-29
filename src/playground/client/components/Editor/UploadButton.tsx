import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import ConfirmModal from "../Modals/ConfirmModal";
import ErrorModal from "../Modals/ErrorModal";

function UploadButton(setCode: (value: string) => void) {

    const [errMsg, setErrMsg] = useState<string>('');
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const confirmModalMessage =
        "Uploading this code will delete and replace any strategy you may currently have open. Do you want to proceed?";

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (typeof reader.result === "string") {
                        setCode(reader.result); // Set the file's content to the code
                    }
                };
                reader.readAsText(file);
            }
        } catch (error: any) {
            setErrMsg('Error in reading in the file. Try again or use another python file.')
        }
    }

    function upload() {
        // Open file input dialog
        document.getElementById("file-input")?.click();
        setConfirmModalOpen(false); // Close the modal
    }

    return (
        <>
            {errMsg && <ErrorModal msg={errMsg} closeModal={() => setErrMsg('')} />}

            {confirmModalOpen && (
                <ConfirmModal
                    msg={confirmModalMessage}
                    closeModal={() => setConfirmModalOpen(false)}
                    onConfirm={upload}
                />
            )}

            <input
                id="file-input"
                type="file"
                accept=".py"
                className="hidden"
                onChange={handleFileChange}
            />
            <button
                type="button"
                onClick={() => setConfirmModalOpen(true)}
                className="flex px-3 py-1 items-center hover:bg-slate-100 hover:font-bold text-center text-gray-800 tracking-tight"
            >
                <FiUpload size="1.2rem" className="pr-1" />
                upload{" "}
                <span className="text-xs ml-1 text-black font-extralight">
                    (.py file)
                </span>
            </button>
        </>
    );
}

export default UploadButton;
