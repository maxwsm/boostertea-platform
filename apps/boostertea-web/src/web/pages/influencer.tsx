import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import '../mythbusters/index.css';
import MythbustersApp from '../mythbusters/App';

export default function InfluencerPage() {
  return (
    <div className="min-h-screen bg-[#0D0F14] text-white selection:bg-[#C4956A] selection:text-[#0F0B08] overflow-x-hidden pt-20">
      <SEO 
        title="BoosterTea | Академія Амбасадорів & Кастинг" 
        description="Креативна впливова екосистема WSM. Навчальна Influencer LMS, AI Prompt Генератор для TikTok та розвінчування кавових міфів." 
      />
      <Header />

      {/* Hero Section (Glassmorphism & Neon) */}
      <section className="relative py-24 min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Cinematic Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-[#C4956A]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D4FF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D4FF]"></span>
            </span>
            <span className="text-sm font-mono tracking-widest uppercase text-[#E8DDD0]">Платформа для Кріейторів</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter uppercase"
            style={{ fontFamily: '"Syne", sans-serif' }}
          >
            WSM OMNIVERSE: <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4956A] to-[#E8DDD0] text-4xl md:text-6xl lg:text-7xl">
              Твій контент — твоя валюта.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[#A89880] max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Ми не шукаємо просто блогерів. Ми створюємо медіа-атлантів. Приєднуйся до Академії Амбасадорів BoosterTea та трансформуй свій креатив у реальний вплив та прибуток.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="https://t.me/boostertea_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#C4956A] text-[#0F0B08] font-bold rounded-2xl hover:bg-[#D4A57A] transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(196,149,106,0.5)] flex items-center justify-center gap-2"
            >
              <span>Подати Заявку в Telegram</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-3.043-1.197-4.99-4.337-5.143-4.539-.153-.202-1.226-1.632-1.226-3.114 0-1.483.772-2.206 1.045-2.51.274-.303.603-.378.803-.378.2 0 .4.002.574.012.183.01.427-.07.669.513.242.582.825 2.011.899 2.158.074.147.122.319.024.515-.098.196-.147.318-.293.487-.147.169-.306.354-.437.476-.147.137-.301.286-.133.566.168.279.747 1.23 1.604 1.99 1.102.975 2.032 1.278 2.319 1.418.287.14.454.117.622-.07.169-.188.712-.826.9-1.107.187-.281.375-.235.627-.141.253.094 1.617.763 1.893.901.275.138.458.208.526.325.068.117.05.677-.224 1.452z"/>
              </svg>
            </a>
            <a 
              href="#modules"
              className="px-8 py-4 bg-white/[0.05] text-white border border-white/10 font-medium rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center"
            >
              Програма курсу
            </a>
          </motion.div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="modules" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ fontFamily: '"Syne", sans-serif' }}>
              Твій Арсенал
            </h2>
            <p className="text-[#A89880]">Усе необхідне, щоб стати топ-амбасадором.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'Алгоритмічна Алхімія', desc: 'Декодуємо рекомедації TikTok та Reels. Як змусити нейромережі працювати на твої охоплення.' },
              { icon: '🎬', title: 'Cyber-Aesthetics', desc: 'Мистецтво вірального кадру. Створення преміального фуд-контенту, який хочеться «купити» очима.' },
              { icon: '🍵', title: 'Психологія Смаку', desc: 'Глибоке занурення в продукт. Як розповідати про чай так, щоб аудиторія відчувала аромат крізь екран.' },
              { icon: '🏛', title: 'Architect of Influence', desc: 'Побудова особистого бренду всередині WSM. Від першого відео до власної лінійки продуктів.' },
              { icon: '🤖', title: 'AI Prompt Generator', desc: 'Твій персональний ШІ-сценарист: один клік — і в тебе готовий план вірального ролика (адаптований під WSM тренди).' },
              { icon: '💸', title: 'Комісійні Спліти', desc: '10% за кожне замовлення по промокоду. Виплати на картку. Твій контент працює як пасивний дохід.' }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.04] transition-all group"
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform origin-bottom-left">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{card.title}</h3>
                <p className="text-[#A89880] leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mythbusters Integration Component */}
      <section className="py-24 border-t border-white/5 relative bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
            Проект: Руйнівники Міфів
          </h2>
          <p className="text-[#A89880] max-w-2xl mx-auto">
            Один з модулів навчання. Перевір свою експертизу в кавовій індустрії та дізнайся, чому концентрати BoosterTea перемагають традиційні сиропи.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* We embed the legacy Mythbusters App here */}
          <MythbustersApp />
        </div>
      </section>
      
      <Footer />
      <TelegramButton />
    </div>
  );
}
