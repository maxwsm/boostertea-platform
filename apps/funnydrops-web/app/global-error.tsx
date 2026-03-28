"use client";

import { useEffect } from "react";
import { Coffee } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html>
      <body className="bg-black text-white antialiased min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Coffee className="w-24 h-24 text-red-500 animate-pulse" />
              <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Оновлення Рецептури 🍵
          </h1>
          
          <p className="text-gray-400 text-lg">
            Наші сервери на мить відвели погляд і вода закипіла. Ми вже перезаварюємо пуер.
            Будь ласка, оновіть сторінку через хвилину.
          </p>
          
          <button
            onClick={() => reset()}
            className="w-full uppercase font-bold text-sm bg-white text-black py-4 px-8 rounded-full hover:bg-gray-200 transition-colors"
          >
            Спробувати знову
          </button>
        </div>
      </body>
    </html>
  );
}
