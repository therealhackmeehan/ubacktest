import { ReactNode } from "react"
export default function ContentWrapper({children}: {children: ReactNode}) {
    return (
        <div className='mt-16 max-w-7xl mx-auto'>
            <div className="mx-4">
                {children}
            </div>
        </div>
    )
}