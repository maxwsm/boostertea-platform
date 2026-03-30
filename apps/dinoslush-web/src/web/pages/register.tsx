import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col relative overflow-hidden">
      {/* Soft gradient background for DinoSlush */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#ff6b6b]/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#4ecdc4]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <Header />
      
      <main className="flex-1 pt-24 pb-16 flex items-center relative z-10 w-full">
        <div className="max-w-md mx-auto px-4 w-full">
          {/* Frost Glassmorphism Auth Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4ecdc4] to-[#0088cc] rounded-2xl rotate-12 flex items-center justify-center mb-6 shadow-xl shadow-[#4ecdc4]/20">
                <div className="-rotate-12">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">Реєстрація DinoSlush</h2>
              <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mb-8 leading-relaxed">
                Забудьте про складні форми. Підтвердіть Telegram і ви автоматично отримаєте особистий кабінет.
              </p>

              <div className="flex items-center justify-center w-full">
                <a href="https://t.me/boostertea_bot" target="_blank" rel="noreferrer" className="w-full px-8 py-4 bg-[#0088cc] text-white font-medium rounded-2xl hover:bg-[#0077b5] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 hover:shadow-[#0088cc]/30 flex items-center justify-center gap-3">
                  Реєстрація через Telegram
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-[var(--text-primary)]/var(--text-muted)">
            <Link href="/" className="text-[#4ecdc4] font-medium hover:text-[#45b7af] transition-colors inline-flex items-center gap-2 group">
              <span className="w-6 h-6 rounded-full bg-[#4ecdc4]/10 flex items-center justify-center group-hover:bg-[#4ecdc4]/20 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </span>
              На головну сторінку
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
