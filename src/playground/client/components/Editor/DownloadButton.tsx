import { useEffect, useRef } from "react";
import { FiDownload } from "react-icons/fi";

interface DownloadButtonProps {
    code: string;
}

function DownloadButton({ code }: DownloadButtonProps) {
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        // Generate the Blob and Object URL
        const blob = new Blob([code], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);

        // Set the href and download attributes
        if (linkRef.current) {
            linkRef.current.href = url;
            linkRef.current.download = "code.py";
        }

        // Cleanup the Object URL when the component unmounts
        return () => {
            window.URL.revokeObjectURL(url);
        };
    }, [code]);

    return (
        <a
            ref={linkRef}
            className="flex px-3 py-1 items-center hover:bg-slate-100 hover:font-bold text-center text-gray-800 tracking-tight"
        >
            <FiDownload size="1.2rem" className="pr-1" />
            download <span className="text-xs ml-1 font-extralight">(as .py file)</span>
        </a>
    );
}

export default DownloadButton;
