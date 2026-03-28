'use client';

import React, { useEffect, useState } from 'react';

interface PackifyViewerProps {
  designId?: string; // ID згенерованого дизайну в твоєму Packify Бізнес-акаунті
  theme?: 'dark' | 'light';
}

export default function PackifyViewer({ designId = 'boostertea-demo', theme = 'dark' }: PackifyViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPackify() {
      try {
        const res = await fetch('/api/packify');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Авторизацію відхилено');
        
        if (data.token) {
          console.log('[Packify] API підключено. Токен:', data.token);
          // TODO: Ініціалізувати WebGL об'єкт або IFrame від Packify SDK:
          // new window.PackifyEmbed({ container: '#packify-canvas', token: data.token, designId });
          
          setIsLoaded(true);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }

    loadPackify();
  }, [designId]);

  return (
    <div className={`w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-2xl transition-all ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-slate-50 border border-slate-200'}`}>
      
      {/* Стан завантаження */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="text-sm font-medium text-zinc-400">Ініціалізація AI-Дизайну (Packify)...</p>
        </div>
      )}

      {/* Помилки API */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <p className="text-red-400 text-sm font-semibold">
            Помилка AI-Віджета:<br/>
            <span className="font-mono text-xs opacity-70 block mt-2">{error}</span>
          </p>
        </div>
      )}

      {/* Контейнер під 3D WebGL Canvas */}
      <div id="packify-canvas" className="w-full h-full" />
    </div>
  );
}
