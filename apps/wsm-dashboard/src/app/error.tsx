'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Enterprise Dashboard Caught Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-950/20 border border-red-500/30 rounded-2xl p-8 text-center mt-10">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-red-500 mb-2">На жаль, сталася непередбачена помилка.</h2>
      <p className="text-gray-400 text-sm max-w-md mb-6 whitespace-pre-wrap">
        {error.message || "Глобальний перехоплювач помилок зупинив падіння всього дашборду. Ви можете спробувати перезавантажити цей сегмент."}
      </p>
      
      <button
        onClick={() => reset()}
        className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Відновити Сегмент (Try Again)
      </button>
    </div>
  );
}
