function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
            <div className="absolute inset-0 bg-slate-800 dark:bg-white opacity-50"></div>
            <div className="animate-spin">
                <div className="border-gray-500 h-30 w-30 animate-spin rounded-full border-8">
                    <div className="border-gray-400 h-20 w-20 animate-spin rounded-full border-8">
                        <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-8">
                            <div className="bg-gray-200 h-5 w-5 animate-spin rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen;