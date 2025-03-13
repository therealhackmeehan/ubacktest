function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
            <div className="absolute inset-0 bg-slate-800 dark:bg-white opacity-50"></div>
            <div className="border-gray-500 h-30 w-30 animate-spin rounded-full border-t-8"></div>
        </div>
    )
}

export default LoadingScreen;