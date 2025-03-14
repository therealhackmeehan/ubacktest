import { TiDelete } from "react-icons/ti";
import ModalLayout from "../../../../client/components/ModalLayout";
import packages from "./packages";
import useEnterKey from "../../../../client/hooks/useEnterKey";
import { useState } from "react";

export default function PackagesModal({ closeModal }: { closeModal: () => void }) {

    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

    useEnterKey(closeModal);

    return (
        <ModalLayout>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold dark:text-white">What packges can I use<span className="text-slate-800 dark:text-blue-300"> ?</span></h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white' />
                </button>
            </div>

            {!detailsOpen && <div className='h-72 text-center overflow-y-auto m-4 p-2 dark:text-white'>
                {Object.entries(packages).map(([category, packageDetails], categoryIndex) => (
                    <div key={categoryIndex} className="mb-4">
                        <h3 className="text-lg font-bold mb-2 text-end">{category}</h3>
                        {Object.entries(packageDetails).map(([packageName, version], packageIndex) => (
                            <div key={packageIndex}>
                                <div
                                    className="p-1 my-1 text-sm rounded-lg dark:bg-slate-600 duration-500"
                                >
                                    {packageName} <span className="text-xs font-bold">{version && version}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>}

            <button className="my-2 text-start bg-white dark:bg-boxdark text-xs duration-700 hover:underline hover:invert border-2 w-full rounded-lg border-slate-300 dark:border-white dark:text-white p-1" onClick={() => setDetailsOpen(!detailsOpen)}>{detailsOpen ? "Go Back" : "Click for More Details on Packages:"}</button>
            {detailsOpen && (
                <div className="text-xs dark:text-white p-4 font-extralight">
                    <p>Package versions may lag behind the latest releases. To check the current installed versions, run the following above/below a strategy:</p>
                    <p className="text-start font-mono">import subprocess</p>
                    <p className="text-start font-mono">print(subprocess.run(["pip", "freeze"], text=True, capture_output=True).stdout)</p>
                    <br></br>
                    <p>We've preinstalled a broad set of ML and Data Science packages, but not all may be relevant. Some, like visualization libraries, won’t work within the editor.</p>
                </div>
            )}


        </ModalLayout>
    );
};