function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
            <div className="absolute inset-0 bg-slate-800 dark:bg-white opacity-0"></div>
            <div className="border-gray-500 h-15 w-15 animate-spin rounded-full border-t-8"></div>
        </div>
    )
}

export default LoadingScreen;