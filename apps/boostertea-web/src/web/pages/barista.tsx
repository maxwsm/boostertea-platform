import { useState } from 'react';
import { useLocation } from 'wouter';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Coffee, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import Header from '../components/Header';
import { SEO } from '../components/SEO';

const QUESTIONS = [
  {
    text: "Скільки мілілітрів концентрату BoosterTea (помп) потрібно для досягнення ідеального смаку та максимального LTV клієнта?",
    options: ["1 помпа (30 мл)", "2 помпи (60 мл)", "Пів помпи (15 мл)"],
    correct: 1
  },
  {
    text: "Яка ідеальна температура води для заварювання Да Хун Пао?",
    options: ["100°C (Окріп)", "90-98°C", "60-70°C"],
    correct: 1
  },
  {
    text: "Що є головним правилом BoosterTea Syndicate?",
    options: ["Завжди просити чайові", "Ніколи не використовувати сиропи поверх Пуеру", "Економити концентрат"],
    correct: 1
  }
];

export default function BaristaGateway() {
  const [, setLocation] = useLocation();
  const { user, updateUser, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState<'intro' | 'auth' | 'quiz' | 'success'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    if (!isAuthenticated) {
      setStep('auth');
    } else {
      setStep('quiz');
    }
  };

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === QUESTIONS[currentQ].correct;
    if (isCorrect) setScore(s => s + 1);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      finalize(isCorrect ? score + 1 : score);
    }
  };

  const finalize = (finalScore: number) => {
    if (finalScore === QUESTIONS.length && user) {
      // Flawless victory -> Issue coins to global wallet
      updateUser({ bonusPoints: (user.bonusPoints || 0) + 100 });
      setStep('success');
    } else {
      // Failed. Need to retake
      alert('Ти зробив помилки. Справжній Барсіта Сіндикату не помиляється. Спробуй ще раз.');
      setCurrentQ(0);
      setScore(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <SEO title="Barista Gateway | BoosterTea Syndicate" description="Секретний портал для барист. Пройди атестацію та отримай доступ до глобального гаманця WSM Ecosystem." noIndex={true} />
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 pt-24 relative overflow-hidden">
        {/* Abstract Dark Room Vectors */}
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#9FD356] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-xl w-full relative z-10">
          <AnimatePresence mode="wait">
            
            {step === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="text-center bg-black/50 p-10 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="w-20 h-20 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl mx-auto flex items-center justify-center mb-6">
                  <Coffee className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Dark Room <br/><span className="text-[var(--accent)]">Barista Portal</span></h1>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  Вітаємо в закритій системі. Щоб підключити свій особистий WSM Гаманець і отримувати бонуси за кожну правильну чашку BoosterTea, необхідно пройти базову атестацію.
                </p>
                <button onClick={startQuiz} className="w-full bg-[var(--accent)] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#9FD356] transition-all flex items-center justify-center gap-3">
                  Почати Атестацію <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 'auth' && (
              <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center bg-black/50 p-10 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                <Brain className="w-16 h-16 text-zinc-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Ідентифікація Особи</h2>
                <p className="text-zinc-400 mb-8">Щоб нарахувати тобі монети після атестації, необхідно увійти в систему.</p>
                <button onClick={() => setLocation('/login?redirect=/barista')} className="w-full bg-white text-black font-bold uppercase py-4 rounded-xl hover:bg-zinc-200 transition-all">
                  Авторизація через WSM ID
                </button>
              </motion.div>
            )}

            {step === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-left bg-black/50 p-10 rounded-[2rem] border border-[var(--accent)]/30 backdrop-blur-xl shadow-[0_0_50px_rgba(159,211,86,0.05)]">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent)]">Питання {currentQ + 1} / {QUESTIONS.length}</div>
                  <div className="flex gap-1">
                    {QUESTIONS.map((_, i) => (
                      <div key={i} className={`h-1.5 w-8 rounded-full ${i <= currentQ ? 'bg-[var(--accent)]' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-8 leading-snug">{QUESTIONS[currentQ].text}</h2>

                <div className="space-y-4">
                  {QUESTIONS[currentQ].options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] transition-all group flex items-center justify-between"
                    >
                      <span className="font-medium">{opt}</span>
                      <div className="w-5 h-5 rounded-full border border-white/20 group-hover:border-[var(--accent)] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[var(--accent)] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-gradient-to-br from-[#111] to-black p-10 rounded-[2rem] border border-[#9FD356]/50 backdrop-blur-xl shadow-[0_0_100px_rgba(159,211,86,0.2)]">
                <div className="w-24 h-24 bg-[#9FD356] rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(159,211,86,0.5)]">
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Атестацію складено</h2>
                <p className="text-[#9FD356] font-bold mb-6 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" /> +100 Global WSM Coins Нараховано
                </p>
                <p className="text-zinc-400 mb-8 text-sm">
                  Ти тепер офіційний учасник Синдикату. Заварюй чай правильно, збирай чайові та використовуй WSM Coins у всій нашій екосистемі.
                </p>
                <button onClick={() => setLocation('/account')} className="w-full bg-white text-black font-bold uppercase py-4 rounded-xl hover:bg-zinc-200 transition-all">
                  Перейти в гаманець
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
