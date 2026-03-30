"use client";
import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Sparkles, ChevronRight, Share2, RotateCcw, Zap, Target, Brain, Flame } from 'lucide-react';
import { Button } from '@myth/components/ui/button';
import { useTranslation } from '@myth/hooks/useTranslation';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    icon: typeof Zap;
    archetype: string;
  }[];
}

interface QuizResult {
  archetype: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  tea: string;
  teaEn: string;
  icon: typeof Zap;
  color: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Який твій ідеальний ранок?',
    options: [
      { text: 'Ранкова пробіжка та енергійний старт', icon: Zap, archetype: 'energizer' },
      { text: 'Спокійна медитація з чашкою чаю', icon: Brain, archetype: 'zen' },
      { text: 'Планування дня з кавою', icon: Target, archetype: 'strategist' },
      { text: 'Творча робота вночі', icon: Flame, archetype: 'creator' },
    ],
  },
  {
    id: 2,
    question: 'Як ти борешся зі стресом?',
    options: [
      { text: 'Спорт та фізична активність', icon: Zap, archetype: 'energizer' },
      { text: 'Читання та саморозвиток', icon: Brain, archetype: 'zen' },
      { text: 'Аналіз ситуації та план дій', icon: Target, archetype: 'strategist' },
      { text: 'Творчість та мистецтво', icon: Flame, archetype: 'creator' },
    ],
  },
  {
    id: 3,
    question: 'Твій улюблений смак чаю?',
    options: [
      { text: 'Насичений та міцний', icon: Zap, archetype: 'energizer' },
      { text: 'М\'який та заспокійливий', icon: Brain, archetype: 'zen' },
      { text: 'Класичний та збалансований', icon: Target, archetype: 'strategist' },
      { text: 'Екзотичний з нотками', icon: Flame, archetype: 'creator' },
    ],
  },
  {
    id: 4,
    question: 'Яка твоя суперсила?',
    options: [
      { text: 'Нескінченна енергія', icon: Zap, archetype: 'energizer' },
      { text: 'Глибока концентрація', icon: Brain, archetype: 'zen' },
      { text: 'Стратегічне мислення', icon: Target, archetype: 'strategist' },
      { text: 'Креативність', icon: Flame, archetype: 'creator' },
    ],
  },
];

const quizResults: Record<string, QuizResult> = {
  energizer: {
    archetype: 'energizer',
    title: 'Енерджайзер',
    titleEn: 'The Energizer',
    description: 'Ти — сила природи! Твоя енергія заразна, а ентузіазм невичерпний. Як Mykyta, ти готовий до будь-яких викликів.',
    descriptionEn: 'You are a force of nature! Your energy is contagious and your enthusiasm is endless. Like Mykyta, you\'re ready for any challenge.',
    tea: 'Da Hong Pao — для максимальної енергії',
    teaEn: 'Da Hong Pao — for maximum energy',
    icon: Zap,
    color: '#FF6B35',
  },
  zen: {
    archetype: 'zen',
    title: 'Майстер Дзен',
    titleEn: 'The Zen Master',
    description: 'Ти знаходиш баланс у всьому. Твій спокій та мудрість надихають оточуючих. Як Nazar, ти майстер своєї справи.',
    descriptionEn: 'You find balance in everything. Your calm and wisdom inspire those around you. Like Nazar, you are a master of your craft.',
    tea: 'GABA Tea — для глибокого фокусу',
    teaEn: 'GABA Tea — for deep focus',
    icon: Brain,
    color: '#9B59B6',
  },
  strategist: {
    archetype: 'strategist',
    title: 'Стратег',
    titleEn: 'The Strategist',
    description: 'Твій розум гострий, як лезо. Ти плануєш на крок вперед і завжди досягаєш своїх цілей.',
    descriptionEn: 'Your mind is sharp as a blade. You plan one step ahead and always achieve your goals.',
    tea: 'Pu-Erh — для чіткого мислення',
    teaEn: 'Pu-Erh — for clear thinking',
    icon: Target,
    color: '#4A90E2',
  },
  creator: {
    archetype: 'creator',
    title: 'Творець',
    titleEn: 'The Creator',
    description: 'Твоє уявлення не знає меж. Ти бачиш світ інакше та створюєш щось унікальне.',
    descriptionEn: 'Your imagination knows no bounds. You see the world differently and create something unique.',
    tea: 'Oolong — для творчого натхнення',
    teaEn: 'Oolong — for creative inspiration',
    icon: Flame,
    color: '#E74C3C',
  },
};

export default function Quiz() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { t, language } = useTranslation();
  
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [direction, setDirection] = useState(0);

  const handleStart = useCallback(() => {
    setStarted(true);
    setDirection(1);
  }, []);

  const handleAnswer = useCallback((archetype: string) => {
    const newAnswers = [...answers, archetype];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const counts: Record<string, number> = {};
      newAnswers.forEach(a => {
        counts[a] = (counts[a] || 0) + 1;
      });
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setResult(quizResults[winner]);
    }
  }, [answers, currentQuestion]);

  const handleRetake = useCallback(() => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setDirection(0);
  }, []);

  const question = quizQuestions[currentQuestion];

  return (
    <section 
      id="quiz"
      ref={sectionRef}
      className="relative py-20 sm:py-32 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B2E1B] via-[#0D1F0D] to-[#1B2E1B]" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201, 162, 39, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201, 162, 39, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 200 + i * 100,
              height: 200 + i * 100,
              background: `radial-gradient(circle, ${['#8B1A1A', '#C9A227', '#1B2E1B'][i % 3]}20 0%, transparent 70%)`,
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-[#C9A227]/20 border border-[#C9A227]/30 rounded-full text-[#C9A227] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 inline mr-1" />
            {t('quiz.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4">
            {t('quiz.title1')} <span className="text-[#C9A227]">{t('quiz.title2')}</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t('quiz.description')}
          </p>
        </motion.div>

        {/* Quiz Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12">
            <AnimatePresence mode="wait" custom={direction}>
              {!started ? (
                // Start Screen
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[#C9A227] to-[#8B1A1A] rounded-full flex items-center justify-center mx-auto mb-8">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    {language === 'ua' ? 'Готовий дізнатися правду?' : 'Ready to discover the truth?'}
                  </h3>
                  <p className="text-white/60 mb-8 max-w-md mx-auto">
                    {language === 'ua' 
                      ? '4 питання відкриють твій справжній архетип Руйнівника Міфів'
                      : '4 questions will reveal your true MythBuster archetype'}
                  </p>
                  <Button
                    onClick={handleStart}
                    className="px-10 py-6 bg-gradient-to-r from-[#C9A227] to-[#8B1A1A] text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-[#C9A227]/30 transition-all"
                  >
                    {t('quiz.start')}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              ) : result ? (
                // Result Screen
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <div 
                    className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: `linear-gradient(135deg, ${result.color}, ${result.color}80)` }}
                  >
                    <result.icon className="w-16 h-16 text-white" />
                  </div>
                  
                  <div className="text-sm text-white/40 uppercase tracking-widest mb-2">
                    {t('quiz.results')}
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">
                    {language === 'ua' ? result.title : result.titleEn}
                  </h3>
                  
                  <p className="text-lg text-white/70 mb-6 max-w-lg mx-auto">
                    {language === 'ua' ? result.description : result.descriptionEn}
                  </p>
                  
                  <div className="bg-white/10 rounded-xl p-6 mb-8">
                    <div className="text-sm text-white/40 uppercase tracking-widest mb-2">
                      {language === 'ua' ? 'Твій ідеальний чай' : 'Your perfect tea'}
                    </div>
                    <div className="text-xl font-bold" style={{ color: result.color }}>
                      {language === 'ua' ? result.tea : result.teaEn}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleRetake}
                      variant="outline"
                      className="px-8 py-4 border-white/20 text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t('quiz.retake')}
                    </Button>
                    <Button
                      className="px-8 py-4 bg-[#C9A227] text-white hover:bg-[#b89420]"
                      onClick={() => {
                        const text = language === 'ua' 
                          ? `Я — ${result.title}! Пройди тест і дізнайся свій архетип Руйнівника Міфів`
                          : `I'm ${result.titleEn}! Take the quiz to discover your MythBuster archetype`;
                        navigator.clipboard.writeText(text + ' https://boostertea.com');
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t('quiz.share')}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                // Question Screen
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-white/40 mb-2">
                      <span>{t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {quizQuestions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#C9A227] to-[#8B1A1A]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                    {question.question}
                  </h3>

                  {/* Options */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {question.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(option.archetype)}
                        className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A227]/50 rounded-xl transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 group-hover:bg-[#C9A227]/20 rounded-full flex items-center justify-center transition-colors">
                            <option.icon className="w-6 h-6 text-white/60 group-hover:text-[#C9A227]" />
                          </div>
                          <span className="text-white font-medium">{option.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
