import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col overflow-hidden relative font-mono selection:bg-white selection:text-black">
      {/* T-Lab minimal grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />
      
      <Header />
      
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center relative z-10 w-full px-4">
        <div className="w-full max-w-sm">
          
          <div className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md p-10 relative group">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border border-white/20 bg-[#0088cc]/10 flex items-center justify-center mb-8">
                <svg className="w-5 h-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              
              <h2 className="text-xl uppercase tracking-widest text-white mb-3">T-Lab / ОНБОРДИНГ</h2>
              <div className="w-full h-px bg-white/10 mb-6" />
              <p className="text-white/60 text-xs mb-10 leading-relaxed text-center uppercase tracking-wider">
                Діє політика Zero-Password. Доступ до b2b сервісів T-Lab надається виключно через верифікацію Telegram.
              </p>

              <a href="https://t.me/boostertea_bot" target="_blank" rel="noreferrer" className="w-full flex items-center justify-between border border-[#0088cc] bg-[#0088cc]/10 hover:bg-[#0088cc] text-[#0088cc] hover:text-white transition-all px-6 py-4 uppercase text-xs tracking-widest group">
                <span>Ініціювати Вхід</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </a>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/" className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors flex items-center gap-3">
              <div className="w-8 h-px bg-white/40" />
              <span>[ ESC ] Система Головна</span>
            </Link>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
