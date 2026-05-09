import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ExternalLink } from "lucide-react";

interface ValueSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ValueSyncModal({ isOpen, onClose }: ValueSyncModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm rounded-[24px] p-6 relative overflow-hidden"
            style={{ 
              backgroundColor: "var(--v-bg-card)", 
              border: "1px solid var(--v-border)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
            }}
          >
            {/* Background Accent */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[100px] opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, var(--v-accent) 0%, transparent 70%)" }}
            />

            <button 
              onClick={onClose}
              className="absolute top-5 right-5 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={18} style={{ color: "var(--v-text-dim)" }} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--v-bg-input)", border: "1px solid var(--v-border)" }}
              >
                <Scale size={20} style={{ color: "var(--v-text)" }} />
              </div>

              <h2 className="text-lg font-bold mb-1 font-sans tracking-wide" style={{ color: "var(--v-text)" }}>
                Синхронізація Цінності
              </h2>
              
              <div className="w-8 h-[1px] mb-4" style={{ backgroundColor: "var(--v-accent)" }} />

              <div className="text-[13px] leading-relaxed space-y-4 text-left w-full" style={{ color: "var(--v-text-muted)" }}>
                <p>
                  Ви отримали стратегічне рішення від I³.MRMRRT.ƐI. Цей інструмент створений, щоб давати асиметричну перевагу в переговорах та справах. Ваш доступ залишається відкритим і не буде деактивований.
                </p>
                <p>
                  Час відновити баланс. Моя позиція як архітектора системи: базова цінність Moriarti дорівнює вартості місячної підписки на GPT ($20 / ~800 грн), оскільки він дає значно вищий рівень експертизи.
                </p>
                <p>
                  Я пропоную оформити підписку, переказавши цю суму на Банку. Якщо зараз для вас це коштує менше — окей, вписуйте свою суму. Якщо усвідомите, що Moriarti приніс більше грошей чи зберіг нерви — ви завжди зможете повернутися сюди.
                </p>
              </div>

              <div className="w-full mt-8 flex flex-col gap-3">
                <a 
                  href="https://send.monobank.ua/jar/dMbywRi5S?a=800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-sm font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--v-text)", color: "var(--v-bg)" }}
                  onClick={() => {
                    localStorage.setItem("mrrt_value_synced", Date.now().toString());
                  }}
                >
                  Інвестувати в I³.MRMRRT.ƐI (800 грн)
                  <ExternalLink size={16} />
                </a>

                <button 
                  onClick={onClose}
                  className="w-full py-3 text-[12px] font-mono tracking-widest uppercase transition-opacity hover:opacity-100 opacity-60"
                  style={{ color: "var(--v-text-dim)" }}
                >
                  Продовжити роботу
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
