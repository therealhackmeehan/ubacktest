function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-slate-800 dark:bg-white opacity-50"></div>
            <div className="animate-bounce">
                <div className="border-gray-500 h-30 w-30 animate-spin rounded-full border-8 border-t-600">
                    <div className="border-gray-400/0 h-20 w-20 animate-spin rounded-full border-8">
                        <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-8"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen;