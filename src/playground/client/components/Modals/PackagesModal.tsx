import { TiDelete } from "react-icons/ti";
import ModalLayout from "../../../../client/components/ModalLayout";
import packages from "./packages";
import useEnterKey from "../../../../client/hooks/useEnterKey";

export default function PackagesModal({ closeModal }: { closeModal: () => void }) {

    useEnterKey(closeModal);

    return (
        <ModalLayout>
            <div className='flex justify-between'>
                <h2 className="text-base text-slate-500 font-semibold dark:text-white">What packges can I use<span className="text-slate-800 dark:text-blue-300"> ?</span></h2>
                <button onClick={closeModal}>
                    <TiDelete size='1.8rem' className='hover:rotate-6 text-gray-900 hover:scale-110 dark:text-white' />
                </button>
            </div>

            <div className='h-72 text-center overflow-y-auto m-4 bg-slate-50 p-2 rounded-lg dark:bg-boxdark-2 dark:text-white'>
                {Object.entries(packages).map(([category, packageDetails], categoryIndex) => (
                    <div key={categoryIndex} className="mb-4">
                        <h3 className="text-lg font-bold mb-2 text-end">{category}</h3>
                        {Object.entries(packageDetails).map(([packageName, version], packageIndex) => (
                            <div key={packageIndex}>
                                <div
                                    className="p-1 my-1 text-sm rounded-lg hover:bg-slate-100 dark:hover:text-black dark:bg-slate-600 duration-500"
                                >
                                    {packageName} <span className="text-xs font-bold">{version && version}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="font-extralight p-4 text-xs text-center dark:text-white">
                Note that versions are not updated daily and may lag behind current available version.
            </div>
        </ModalLayout>
    );
};