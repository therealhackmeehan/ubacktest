import { ReactNode } from "react";

function ModalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 w-full opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg z-10">
                {children}
            </div>
        </div>
    );
};

export default ModalLayout;
