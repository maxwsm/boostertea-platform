"use client";

/**
 * WELCOME ONBOARDING — Shown after Vision Calibration
 * 
 * Simple, mom-friendly language explaining what the app does
 * and why it matters in everyday life. No jargon, no complexity.
 * Shown on first visit or after 3+ days absence.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Swords, Users, MessageCircle,
  ChevronRight, Heart, Shield, Sparkles,
} from "lucide-react";

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

const FEATURES = [
  {
    icon: Brain,
    title: "Допомога з рішеннями",
    subtitle: "Коли не знаєш як вчинити",
    description: "Ви описуєте ситуацію — система показує, чому ви відчуваєте те, що відчуваєте, і допомагає побачити варіанти, які ви не помічали.",
    example: "«Мені пропонують нову роботу, але я боюсь кинути стару» → система покаже, звідки цей страх, і що буде при кожному варіанті.",
    color: "#64B5F6",
  },
  {
    icon: Swords,
    title: "Підготовка до зустрічі",
    subtitle: "Коли важлива розмова попереду",
    description: "Перед складною розмовою з босом, партнером чи клієнтом — система допоможе зрозуміти, як думає інша сторона, і підготувати аргументи.",
    example: "«Завтра переговори з інвестором» → побачите його слабкі місця, ваші сильні сторони, і план розмови.",
    color: "#FF8A65",
  },
  {
    icon: Users,
    title: "Сімейна нарада",
    subtitle: "Коли треба домовитись з рідними",
    description: "Допомагає структурувати сімейні рішення: від бюджету до виховання дітей. Кожен учасник отримує голос, а система знаходить компроміс.",
    example: "«Ми з чоловіком не можемо домовитись про школу для дитини» → покаже потреби кожного і варіант, де обидва виграють.",
    color: "#81C784",
  },
  {
    icon: MessageCircle,
    title: "Пояснення складних тем",
    subtitle: "Коли треба пояснити щось дитині або дорослому",
    description: "Адаптує пояснення під вік: дитині — через казки і метафори, дорослому — через факти і приклади з життя.",
    example: "«Як пояснити 7-річній дитині чому ми переїжджаємо?» → отримаєте пояснення мовою дитини, з метафорами які вона зрозуміє.",
    color: "#CE93D8",
  },
];

export function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLastSlide = currentSlide === FEATURES.length; // +1 for final slide

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center px-5 pt-12 pb-32 gap-6 min-h-screen">

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {[...Array(FEATURES.length + 1)].map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === currentSlide ? 24 : 6,
              height: 6,
              backgroundColor: i === currentSlide ? "var(--v-accent)" : "var(--v-border)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentSlide < FEATURES.length ? (
          /* Feature slides */
          <motion.div
            key={`feature-${currentSlide}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center gap-6 w-full"
          >
            {/* Icon */}
            <motion.div
              className="w-20 h-20 rounded-[24px] flex items-center justify-center"
              style={{ backgroundColor: "var(--v-accent-muted)" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            >
              {(() => {
                const Icon = FEATURES[currentSlide].icon;
                return <Icon size={36} style={{ color: FEATURES[currentSlide].color }} />;
              })()}
            </motion.div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold" style={{ color: "var(--v-text)" }}>
                {FEATURES[currentSlide].title}
              </h2>
              <p className="text-sm" style={{ color: FEATURES[currentSlide].color }}>
                {FEATURES[currentSlide].subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-center" style={{ color: "var(--v-text-muted)" }}>
              {FEATURES[currentSlide].description}
            </p>

            {/* Example card */}
            <div
              className="w-full p-4 rounded-[16px]"
              style={{
                backgroundColor: "var(--v-bg-card)",
                border: "1px solid var(--v-border)",
              }}
            >
              <div className="flex items-start gap-2">
                <Sparkles size={14} style={{ color: "var(--v-accent)", flexShrink: 0, marginTop: 3 }} />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--v-text-dim)" }}>
                    Приклад із життя
                  </p>
                  <p className="text-xs leading-relaxed italic" style={{ color: "var(--v-text-muted)" }}>
                    {FEATURES[currentSlide].example}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Final slide — summary */
          <motion.div
            key="final"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center gap-6 w-full"
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--v-accent-muted)" }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              <Shield size={36} style={{ color: "var(--v-accent)" }} />
            </motion.div>

            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold" style={{ color: "var(--v-text)" }}>
                Ваш особистий радник
              </h2>
              <p className="text-sm" style={{ color: "var(--v-accent)" }}>
                Завжди поруч, коли потрібно
              </p>
            </div>

            <p className="text-sm leading-relaxed text-center" style={{ color: "var(--v-text-muted)" }}>
              Це не чергова "мотиваційна" програма. Це інструмент, який працює на основі реальної науки про мозок і поведінку. Він допомагає зрозуміти себе і приймати рішення з ясною головою — без стресу і тиску.
            </p>

            <div className="w-full flex flex-col gap-2">
              {[
                { icon: Heart, text: "Без складних термінів — все простою мовою" },
                { icon: Brain, text: "На основі науки, а не гороскопів" },
                { icon: Shield, text: "Ваші дані залишаються тільки у вас" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-[14px]"
                  style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}
                >
                  <item.icon size={18} style={{ color: "var(--v-accent)", flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: "var(--v-text-muted)" }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center px-5">
        <div className="w-full max-w-md flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={() => setCurrentSlide(prev => prev - 1)}
              className="flex-shrink-0 px-5 py-3.5 rounded-[14px] text-xs font-mono uppercase tracking-widest"
              style={{ color: "var(--v-text-dim)", border: "1px solid var(--v-border)" }}
            >
              Назад
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-[14px] text-sm font-bold flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--v-accent)",
              color: "var(--v-bg)",
            }}
          >
            {isLastSlide ? "Почати" : "Далі"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
