import { TiDelete } from "react-icons/ti";
import ModalLayout from "../../../../client/components/ModalLayout";
import packages from "./packages";
import useEnterKey from "../../../../client/hooks/useEnterKey";
import { useState } from "react";
import { useQuery, getPackageInfo } from "wasp/client/operations";
import LoadingScreen from "../../../../client/components/LoadingScreen";

export default function PackagesModal({ closeModal }: { closeModal: () => void }) {

    const { data: packageInfo, isLoading: isPackageInfoLoading, error: packageInfoError } = useQuery(getPackageInfo);
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

    useEnterKey(closeModal);

    return (
        <ModalLayout closeModal={closeModal}>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold dark:text-white">What packges can I use<span className="text-slate-800 dark:text-blue-300"> ?</span></h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white' />
                </button>
            </div>

            {isPackageInfoLoading && <LoadingScreen />}

            {!packageInfoError && packageInfo && !detailsOpen && <>
                <textarea rows={13} className='my-4 rounded-lg w-full border-0 border-transparent resize-none bg-white font-mono text-xs text-black-700 dark:bg-black dark:text-gray-200' readOnly={true} value={packageInfo.info || "error loading package info."}>
                </textarea>
                <div className="text-xs mb-2 text-center dark:text-white">Package Versions Last Updated: <span className="italic">{packageInfo.date.toDateString()}</span></div>
            </>}

            <button className="my-2 text-start bg-white dark:bg-boxdark text-xs duration-700 hover:underline hover:invert border-2 w-full rounded-lg border-slate-300 dark:border-white dark:text-white p-1" onClick={() => setDetailsOpen(!detailsOpen)}>{detailsOpen ? "Go Back" : "Click for More Details on Packages:"}</button>
            {detailsOpen && (
                <div className="text-xs dark:text-white p-4 font-extralight">
                    <p>Package versions may lag behind the latest releases, but we do our best to update this list weekly. </p>
                    <br></br>
                    <p>We've preinstalled a broad set of ML and Data Science packages, but not all may be relevant. Some, like visualization libraries, won’t work within the editor.</p>
                </div>
            )}


        </ModalLayout>
    );
};