export default function SwirlyBackground() {
    return (
        <>
            <div
                className='absolute top-0 right-0 transform-gpu overflow-hidden w-full blur-3xl sm:top-0 pointer-events-none'
                aria-hidden='true'
            >
                <div
                    className='aspect-[1020/880] w-[55rem] flex-none sm:right-1/4 sm:translate-x-1/2 bg-gradient-to-tr from-sky-500 dark:from-sky-700 to-slate-400 opacity-40'
                    style={{
                        clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)',
                    }}
                />
            </div>
            <div
                className='absolute inset-x-0 top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] transform-gpu overflow-hidden blur-3xl pointer-events-none'
                aria-hidden='true'
            >
                <div
                    className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 bg-gradient-to-br from-sky-700 to-slate-300 dark:to-sky-800 opacity-30 w-[72.1875rem]'
                    style={{
                        clipPath: 'ellipse(80% 30% at 80% 50%)',
                    }}
                />
            </div>
        </>
    )
}