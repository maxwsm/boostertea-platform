import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          {/* Decorative Elements */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#ff00ff]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-[#00ffff]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 mb-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0088cc] to-[#ff00ff] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#ff00ff]/30 animate-pulse">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">Швидка Реєстрація</h2>
              <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                Зареєструйтесь через Telegram в один клік, щоб отримати 10% кешбеку на першу покупку FunnyDrops енергії.
              </p>

              <div className="flex items-center justify-center w-full">
                <a href="https://t.me/boostertea_bot" target="_blank" rel="noreferrer" className="w-full px-8 py-3.5 bg-gradient-to-r from-[#0088cc] to-[#ff00ff] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#ff00ff]/20 flex items-center justify-center gap-3">
                  Реєстрація через Telegram
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-[var(--text-primary)]/var(--text-muted)">
            <Link href="/" className="text-[#00ffff] font-semibold hover:underline flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Повернутись на головний екран
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
