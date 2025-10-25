function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 dark:bg-slate-900/20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-sky-600" />
    </div>
  );
}

export default LoadingScreen;
