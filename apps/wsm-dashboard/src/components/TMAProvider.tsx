'use client';

import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TMAProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Ініціалізація Telegram Web App API
    if (typeof window !== 'undefined' && WebApp) {
      WebApp.ready();
      WebApp.expand(); // Розгорнути на весь екран
      WebApp.setHeaderColor('#000000'); // Темний преміум-хедер
      WebApp.setBackgroundColor('#09090b'); // Темний преміум фон
      
      // Блокування базових жестів і виділення (Anti-Leak Layer 1)
      document.body.style.userSelect = 'none';
      if (WebApp.disableVerticalSwipes) {
        WebApp.disableVerticalSwipes();
      }

      // Витягуємо ID юзера для невидимого водяного знаку
      try {
        if (WebApp.initDataUnsafe?.user?.id) {
          setUserId(WebApp.initDataUnsafe.user.id.toString());
        }
      } catch (e) {}
      
      // Вмикаємо Haptic Feedback (фізичний відгук) при старті
      WebApp.HapticFeedback.impactOccurred('medium');
    }
  }, []);

  if (!isMounted) return null; // Уникаємо гідратаційних конфліктів

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen bg-[#09090b] text-zinc-50 font-sans antialiased overflow-x-hidden"
      >
        {/* Глобальний бекграунд 3D blur-ефектів (Glassmorphism Core) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full" />
        </div>
        
        {/* Контент Міні-Апки */}
        <div className="relative z-10 w-full h-full max-w-md mx-auto">
          {children}
        </div>

        {/* Невидимий Водяний Знак (DeepMind Leak Tracing) */}
        {userId && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center opacity-[0.015] overflow-hidden">
            <div className="transform -rotate-45 space-y-24 text-[8px] tracking-[0.5em] text-white/50 w-[200vw] text-center filter blur-[0.3px]">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="whitespace-nowrap">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <span key={j} className="mx-12">TITAN.OS • UID:{userId}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
