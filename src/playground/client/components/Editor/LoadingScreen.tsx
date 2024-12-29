function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-slate-800 opacity-50"></div>
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-600"></div>
        </div>
    )
}

export default LoadingScreen;