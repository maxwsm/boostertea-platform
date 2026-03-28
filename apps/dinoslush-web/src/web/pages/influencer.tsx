import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO, useSEOConfig } from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Influencer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ instagram_handle: '', age: '', motivation_text: '' });
  const [promptTopic, setPromptTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const seoConfig = useSEOConfig('adaptation'); // Or fallback to dynamic

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(formData.age) < 16) {
      alert('Вам має бути більше 16 років для участі в програмі.');
      return;
    }
    setStep(3); // Перехід до success / Prompt gateway
  };

  const generatePrompt = () => {
    if (!promptTopic) return;
    setGeneratedScript('');
    setIsTyping(true);
    
    setTimeout(() => {
      const scriptText = `Сценарій для TikTok/Reels: ${promptTopic}\n\n🎬 [0-3 сек] Хук:\nКадр втомленого обличчя, різкий зум на банку BoosterTea. Текст на екрані: "1 шот замість 3 еспресо?"\n\n🗣️ [3-10 сек] Розповідь:\nПоказуєш процес приготування: вода + 2 натиски спрею.\nТекст: "Жодних турків і капання кави. 15 секунд і ти маєш енергію на 6 годин."\n\n🎯 [10-15 сек] Call to Action:\nП'єш, заплющуєш очі від кайфу. На екрані мигає твій код.\nТекст: "Замовляй за промокодом + отримай гамак в подарунок!"`;
      
      let i = 0;
      const intervalId = setInterval(() => {
        setGeneratedScript(prev => prev + scriptText.charAt(i));
        i++;
        if (i === scriptText.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, 20); // Швидкість друкування
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8DDD0] relative overflow-hidden">
      <SEO title="BoosterTea Creators | Закрите LMS & AI Tools" description="Академія амбасадорів BoosterTea. Доступ до закритих уроків, AI-генератора сценаріїв та реферальних виплат." />
      <Header />

      {/* Background FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-40 left-0 w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="text-center">
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-[var(--accent)] rounded-full text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
                 <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]"></span></span>
                 Академія Амбасадорів & Creators LMS
               </motion.div>
               
               <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                 Premium Level <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#7FB030]">Creator Ecosystem</span>
               </h1>
               
               <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
                 Ми перетворюємо блогування на системний бізнес. Закритий LMS портал, ексклюзивні дропи одягу та твій власний Cloud AI-асистент для створення вірусних Reels.
               </p>

               <button 
                 onClick={() => setStep(2)}
                 className="px-10 py-5 bg-[var(--accent)] text-black text-xl font-bold rounded-2xl hover:bg-[#D4A57A] transition-all hover:scale-105 shadow-[0_0_30px_rgba(201,169,98,0.3)]"
               >
                 Подати Заявку (До 30 Травня)
               </button>
               
               <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md hover:border-[var(--accent)]/50 transition-colors">
                    <div className="text-5xl mb-6">🧠</div>
                    <h3 className="text-white text-xl font-bold mb-3">AI Prompt Gateway</h3>
                    <p className="text-white/50 text-sm leading-relaxed">Наш Telegram-бот автоматично пише ідеальні, конвертуючі сценарії для твоїх відео під нашу продукцію.</p>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md hover:border-[var(--accent)]/50 transition-colors">
                    <div className="text-5xl mb-6">🎓</div>
                    <h3 className="text-white text-xl font-bold mb-3">Закритий LMS</h3>
                    <p className="text-white/50 text-sm leading-relaxed">Навчання від топових маркетологів: алгоритми TikTok 2026, воронки продажів через сторіс та побудова особистого бренду.</p>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md hover:border-[var(--accent)]/50 transition-colors">
                    <div className="text-5xl mb-6">💸</div>
                    <h3 className="text-white text-xl font-bold mb-3">Пряма Монетизація</h3>
                    <p className="text-white/50 text-sm leading-relaxed">Високі реферальні % з продажів, бонусні гривні та виплати на карту без затримок.</p>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto relative">
               <button onClick={() => setStep(1)} className="absolute -top-12 left-0 text-white/50 hover:text-white flex items-center gap-2">← Назад</button>
               <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                 <h2 className="text-3xl font-extrabold text-white mb-2">Заявка в Екосистему</h2>
                 <p className="text-white/50 mb-8 text-sm">Ми відбираємо лише 50 контент-мейкерів на цей сезон.</p>
                 
                 <form onSubmit={handleApply} className="space-y-6">
                    <div>
                      <label className="block text-white/70 text-sm font-bold mb-2">Instagram або TikTok Handle</label>
                      <input required value={formData.instagram_handle} onChange={e => setFormData({...formData, instagram_handle: e.target.value})} type="text" placeholder="@username" className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-bold mb-2">Твій вік (16+ Only)</label>
                      <input required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} type="number" min="10" placeholder="Ваш вік" className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-bold mb-2">Розкажи про свою мотивацію</label>
                      <textarea required value={formData.motivation_text} onChange={e => setFormData({...formData, motivation_text: e.target.value})} rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-colors resize-none" placeholder="Чому ти хочеш стати амбасадором BoosterTea?"></textarea>
                    </div>
                    <button type="submit" className="w-full py-4 bg-[var(--accent)] text-black font-extrabold tracking-wide rounded-xl hover:bg-[#D4A57A] transition-colors mt-4">
                      НАДІСЛАТИ ЗАЯВКУ
                    </button>
                 </form>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-7xl block mb-6 animate-bounce">🧬</span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Вітаємо у Лабораторії!</h2>
                <p className="text-white/60 text-lg">Заявка на модерації. А поки, щоб ти не нудьгував, підключи свого офіційного Cloud AI Асистента або протестуй його прямо тут.</p>
                
                <a href="https://t.me/boostertea_creators_bot" target="_blank" rel="noopener noreferrer" className="inline-flex mt-8 px-8 py-4 bg-[#0088cc] text-white font-bold rounded-xl hover:bg-[#0077b5] transition-transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,136,204,0.3)]">
                  Перейти в @boostertea_creators_bot
                </a>
              </div>
              
              <div className="bg-black/40 border border-white/10 shadow-2xl p-8 rounded-[2rem] backdrop-blur-md">
                 <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><span>✨</span> AI Prompt Gateway (Demo)</h3>
                 <p className="text-sm text-white/40 mb-6">Вбудована нейромережа, натренована на алгоритмах конверсії BoosterTea.</p>
                 
                 <div className="flex flex-col sm:flex-row gap-4 mb-6">
                   <input 
                     value={promptTopic} 
                     onChange={e => setPromptTopic(e.target.value)}
                     disabled={isTyping}
                     type="text" 
                     placeholder="Введи тему сцеранію (напр. 'Енергія зранку')" 
                     className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--accent)] outline-none disabled:opacity-50"
                   />
                   <button onClick={generatePrompt} disabled={isTyping || !promptTopic} className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition-colors">
                     Генерувати
                   </button>
                 </div>
                 
                 <AnimatePresence>
                   {(generatedScript || isTyping) && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 bg-black/60 rounded-2xl border border-[var(--accent)]/30 font-mono text-sm sm:text-base text-[var(--accent)] whitespace-pre-wrap leading-relaxed shadow-inner">
                       <span className="opacity-80 break-words">{generatedScript}</span>
                       {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="inline-block w-2 h-4 bg-[var(--accent)] ml-1 align-middle"></motion.span>}
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}
