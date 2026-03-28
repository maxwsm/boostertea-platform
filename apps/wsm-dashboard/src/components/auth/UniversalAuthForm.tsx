'use client';

import React, { useState } from 'react';

export default function UniversalAuthForm() {
  const [method, setMethod] = useState<'telegram' | 'google' | 'phone'>('telegram');

  return (
    <div className="max-w-md w-full p-8 rounded-2xl border backdrop-blur-xl relative overflow-hidden" 
         style={{ backgroundColor: 'rgba(20, 23, 32, 0.8)', borderColor: '#252A3A' }}>
      
      {/* Dynamic Glow based on chosen method */}
      <div className="absolute -top-20 -right-20 w-40 h-40 blur-3xl opacity-20 pointer-events-none transition-colors duration-500" 
           style={{ backgroundColor: method === 'telegram' ? '#229ED9' : method === 'google' ? '#EA4335' : '#00D4FF' }} />

      <h2 className="text-2xl font-bold text-center text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
        Universal Access
      </h2>
      <p className="text-sm text-center mb-8" style={{ color: '#9CA3AF' }}>
        Єдиний ключ до всієї екосистеми
      </p>

      {/* Auth Methods List */}
      <div className="flex flex-col gap-3 mb-6">
        <button 
          onMouseEnter={() => setMethod('telegram')}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#229ED9', color: '#FFF' }}>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.33-.01-.97-.19-1.45-.34-.58-.19-1.03-.29-1-.61.02-.17.25-.34.69-.53 2.7-1.18 4.51-1.93 5.39-2.3 2.58-1.06 3.12-1.25 3.47-1.25.07 0 .24.02.32.08.07.05.1.13.11.23-.01.07-.02.26-.06.56z"/></svg>
          Вхід через Telegram
        </button>

        <button 
          onMouseEnter={() => setMethod('google')}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-lg font-semibold transition-all"
          style={{ backgroundColor: '#FFFFFF', color: '#1F2937' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Вхід через Google
        </button>

        <div className="flex items-center my-2">
          <div className="flex-1 border-t" style={{ borderColor: '#252A3A' }}></div>
          <span className="px-3 text-xs" style={{ color: '#6B7280' }}>АБО ПРОДОВЖТЕ З</span>
          <div className="flex-1 border-t" style={{ borderColor: '#252A3A' }}></div>
        </div>

        <button 
          onMouseEnter={() => setMethod('phone')}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-lg font-semibold transition-all hover:bg-white/10"
          style={{ backgroundColor: 'transparent', color: '#FFF', border: '1px solid #4B5563' }}>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          Номер телефону (OTP)
        </button>
      </div>

      <div className="text-center mt-6 pt-4 border-t" style={{ borderColor: '#252A3A' }}>
        <button className="text-xs hover:underline transition-colors font-medium" style={{ color: '#00D4FF' }}>
          ⚡️ Забули або хочете змінити пароль?
        </button>
      </div>
    </div>
  );
}
