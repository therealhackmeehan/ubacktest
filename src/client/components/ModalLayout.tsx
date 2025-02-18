import { ReactNode, useEffect } from "react";

function ModalLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Disable scrolling when modal is open
        document.body.style.overflow = "hidden";

        return () => {
            // Re-enable scrolling when modal is closed
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 dark:bg-white w-full opacity-50 dark:opacity-75 fixed inset-0"></div>
            <div className="bg-white p-6 w-5/6 lg:w-1/3 rounded-lg shadow-lg z-10 dark:bg-boxdark">
                {children}
            </div>
        </div>
    );
}

export default ModalLayout;
