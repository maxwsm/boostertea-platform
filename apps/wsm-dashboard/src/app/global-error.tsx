'use client';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-[#050505] text-white flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Критичний збій Маршрутизатора</h2>
          <p className="text-gray-400 mb-6 font-mono text-sm">{error.message}</p>
          <button onClick={() => reset()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded">
            Hard Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
