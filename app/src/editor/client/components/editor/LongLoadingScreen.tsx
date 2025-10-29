import { useState, useEffect } from "react";

const messages = [
  "",
  "Analyzing market trends... 📈",
  "Optimizing trading strategy... ⚡",
  "Simulating historical trades... ⏳",
  "Fine-tuning risk parameters... 🎯",
  "Backtesting against real market data... 📊",
  "Running deep learning predictions... 🤖",
  "Complex strategies take time—stay patient! 🕰️",
  "Crunching numbers and finding alpha... 🔎",
];

function LongLoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-800 dark:bg-white opacity-50"></div>

      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 border-4 border-gray-300 border-t-sky-700 dark:border-t-blue-300 animate-spin rounded-full"></div>
        <div className="absolute h-10 w-10 bg-sky-700 dark:bg-blue-300 rounded-full animate-pulse"></div>
      </div>

      {/* Rotating Messages */}
      <div className="mt-5 text-white z-10 text-xl font-light tracking-tight transition-opacity animate-bounce duration-500 animate-fadeInOut">
        {messages[messageIndex]}
      </div>
    </div>
  );
}

export default LongLoadingScreen;
