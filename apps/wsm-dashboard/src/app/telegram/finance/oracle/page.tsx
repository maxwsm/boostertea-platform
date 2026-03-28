'use client';

import { motion } from 'framer-motion';
import { Mic, ChevronLeft, Bot, Sparkles } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeepMindOracleUI() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => router.back());
    return () => WebApp.BackButton.hide();
  }, [router]);

  if (!isReady) return null;

  const handleMicToggle = () => {
    if (isRecording) {
      WebApp.HapticFeedback.notificationOccurred('success');
      setIsRecording(false);
      // Simulate Deep Mind processing
      setTimeout(() => {
        setResponse("Аналіз завершено. Борг ФОП Кондратюк за ЄСВ складає 5,280 ₴. Дедлайн сплати: 09 Травня. Створити задачу в ClickUp для бухгалтера?");
      }, 1500);
    } else {
      WebApp.HapticFeedback.impactOccurred('heavy');
      setIsRecording(true);
      setResponse(null);
    }
  };

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-20 flex flex-col items-center justify-between bg-[#09090b]">
      {/* Background Grid & Blur */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-[20%] w-72 h-72 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex items-center justify-center z-10"
      >
        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <Sparkles size={16} className="text-blue-400" />
          <h1 className="text-sm font-bold tracking-widest text-white uppercase">The Oracle</h1>
        </div>
      </motion.header>

      {/* Conversation Area */}
      <div className="flex-1 w-full flex flex-col justify-center items-center z-10 text-center px-4">
        {response ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-xl"
          >
            <Bot size={32} className="text-blue-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium leading-relaxed">{response}</p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold active:scale-95 transition-transform" onClick={() => WebApp.showAlert('Задача відправлена в ClickUp!')}>Створити Таску</button>
          </motion.div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-500 font-medium text-lg"
          >
            {isRecording ? "Слухаю вказівки..." : "Готовий до ваших питань, Засновнику."}
          </motion.p>
        )}
      </div>

      {/* Voice Core AI Button */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-10"
      >
        {isRecording && (
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30 scale-150" />
        )}
        <button 
          onClick={handleMicToggle}
          className={`relative flex items-center justify-center w-24 h-24 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-300 \${isRecording ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-110' : 'bg-gradient-to-br from-blue-600 to-indigo-800'}`}
        >
          <Mic size={36} className="text-white" />
        </button>
      </motion.div>
    </div>
  );
}
