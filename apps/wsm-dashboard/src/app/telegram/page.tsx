'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WebApp from '@/lib/twa';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { validateAndAuthTmaUser } from './actions';

export default function TelegramPortal() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authenticate() {
      if (typeof window === 'undefined' || !WebApp) return;

      const initData = WebApp.initData;
      if (!initData) {
        setError("Помилка доступу. Відкрийте через офіційного бота.");
        return;
      }

      // 1. Справжня Бекенд-Авторизація через Server Action (HMAC SHA-256)
      console.log("[TMA Portal] Passing initData to Core Backend Auth...");
      const res = await validateAndAuthTmaUser(initData);

      if (res.error) {
        setError("Помилка ідентифікації: " + res.error);
        WebApp.HapticFeedback.notificationOccurred('error');
        return;
      }

      // 2. Розумний RBAC Роутинг на основі справжньої БД
      setTimeout(() => {
        WebApp.HapticFeedback.notificationOccurred('success');
        
        switch (res.role) {
          case 'ADMIN':
          case 'MANAGER':
            router.push('/telegram/finance'); // Founder Dashboard
            break;
          case 'PACKER':
            router.push('/telegram/warehouse'); // Warehouse Terminal
            break;
          default:
            router.push('/telegram/store'); // Fallback B2C Store
            break;
        }
      }, 1000); // Симуляція 3D анімації / Loader
    }

    authenticate();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#050505] overflow-hidden">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl shadow-[0_40px_80px_rgba(59,130,246,0.15)] z-10"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 animate-pulse rounded-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          {error ? (
            <div className="text-red-400 text-center text-sm font-mono max-w-[250px] bg-red-900/20 p-4 border border-red-500/20 rounded-xl">
              {error}
            </div>
          ) : (
            <>
              <div className="relative mb-6">
                 <Loader2 size={48} className="text-blue-500 animate-spin" />
                 <span className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-blue-400 animate-ping"></span>
              </div>
              <h2 className="text-2xl font-black tracking-[0.2em] text-white">TITAN<span className="text-zinc-500 font-light drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">.OS</span></h2>
              <p className="text-zinc-500 text-[10px] mt-4 font-mono uppercase tracking-widest text-[#00ff66]">Syncing Neural Auth...</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
