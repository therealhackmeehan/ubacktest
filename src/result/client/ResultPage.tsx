import { useState } from "react";
import ContentWrapper from "../../client/components/ContentWrapper";
import SharedWithMe from "./components/SharedWithMe";
import MyResults from "./components/MyResults";

function ResultPage() {

    const [sharedWithMeTabOpen, setSharedWithMeTabOpen] = useState<boolean>(false);

    return (
        <ContentWrapper>
            <div className='flex justify-between'>
                <h4 className='my-2 font-bold tracking-tight text-gray-900 text-3xl dark:text-white'>
                    My <span className='text-sky-600'>Results</span>
                </h4>
            </div>
            <div className='border-b-2 border-slate-400'></div>
            <div className="w-full grid grid-cols-4 p-1 my-6 gap-x-2 rounded-lg bg-slate-200 shadow-lg text-sm">
                <button className={`col-span-2 rounded-lg p-0.5 duration-500 text-center ${!sharedWithMeTabOpen ? "bg-slate-800 text-white" : "text-slate-300"}`}
                    onClick={() => setSharedWithMeTabOpen(false)}>
                    Owned by me
                </button>
                <button className={`col-span-2 rounded-lg p-0.5 duration-500 text-center ${sharedWithMeTabOpen ? "bg-slate-800 text-white" : "text-slate-300"}`}
                    onClick={() => setSharedWithMeTabOpen(true)}>
                    Shared with me
                </button>
            </div>
            {
                sharedWithMeTabOpen ? <SharedWithMe /> : <MyResults />
            }

        </ContentWrapper>
    )
}

export default ResultPage;