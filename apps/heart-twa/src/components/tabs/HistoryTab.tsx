"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, ChevronDown, ChevronUp, Clock, Loader2 } from "lucide-react";

export function HistoryTab({ isAdhdMode }: { isAdhdMode: boolean }) {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let telegramId = "test_user_1"; // fallback for browser
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
          telegramId = String((window as any).Telegram.WebApp.initDataUnsafe.user.id);
        }

        const res = await fetch(`/api/history?telegramId=${telegramId}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data.sessions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-graphite">
        <Loader2 className="animate-spin text-sage" size={32} />
      </div>
    );
  }

  // Calculate trends for sparkline (last 5-10 sessions)
  const sessionsWithBiometrics = history.filter(s => s.aiResponse?.biometrics?.current?.cortisolLevel !== undefined);
  const reversedSessions = [...sessionsWithBiometrics].reverse(); // oldest to newest for chart

  return (
    <div className="w-full min-h-full flex flex-col items-center p-6 bg-graphite pb-48">
      <div className="text-center space-y-2 mb-8 z-10 w-full max-w-md">
        <h1 className="text-2xl font-sans font-light tracking-tight text-oatmeal">Персональний Кабінет</h1>
        <p className="text-oatmeal/50 font-mono text-xs uppercase tracking-widest">[ Нейро-Тренди ]</p>
      </div>

      {history.length === 0 ? (
        <div className="text-oatmeal/40 text-center font-mono text-sm">
          Історія сесій порожня. Зробіть перший діагноз.
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-6">
          
          {/* Trend Sparkline */}
          {reversedSessions.length > 1 && (
            <div className={`w-full p-5 rounded-[24px] border ${isAdhdMode ? 'bg-graphite/80 border-oatmeal/20' : 'bg-graphite/40 border-oatmeal/10'}`}>
              <h3 className="text-xs font-mono uppercase tracking-widest text-oatmeal/60 mb-4 flex items-center gap-2">
                <Activity size={14} /> Динаміка Стресу (Кортизол)
              </h3>
              <div className="w-full h-24 flex items-end justify-between gap-1 relative pt-4">
                {reversedSessions.map((s, idx) => {
                  const cortisol = s.aiResponse.biometrics.current.cortisolLevel;
                  const heightPercentage = Math.max(10, cortisol); // min 10% for visibility
                  const isHigh = cortisol > 70;
                  return (
                    <motion.div 
                      key={s.id}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`w-full rounded-t-sm relative group cursor-pointer ${isHigh ? 'bg-red-500/80' : 'bg-ocean/80'}`}
                    >
                      {/* Tooltip on hover/active */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-oatmeal bg-black/80 px-2 py-1 rounded">
                        {cortisol}%
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between text-[10px] text-oatmeal/40 font-mono mt-2">
                <span>Минулі</span>
                <span>Останні</span>
              </div>
            </div>
          )}

          {/* Timeline / Accordion */}
          <div className="w-full flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-oatmeal/60 mb-2 flex items-center gap-2">
              <Clock size={14} /> Історія Діагнозів
            </h3>
            {history.map((session) => {
              const isExpanded = expandedId === session.id;
              const date = new Date(session.timestamp).toLocaleDateString('uk-UA', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
              const { identityArchetype, nervousSystemState, shadowTrigger, totemAdvice } = session.aiResponse;

              return (
                <div key={session.id} className="w-full flex flex-col bg-graphite/60 border border-oatmeal/10 rounded-[20px] overflow-hidden transition-all">
                  <button 
                    onClick={() => setExpandedId(isExpanded ? null : session.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-oatmeal/5 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-ocean font-mono uppercase">{date}</span>
                      <span className={`text-sm text-oatmeal font-bold ${isAdhdMode ? 'text-base' : ''}`}>{nervousSystemState}</span>
                      <span className="text-xs text-oatmeal/60 truncate max-w-[200px]">{identityArchetype}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-oatmeal/40" /> : <ChevronDown size={18} className="text-oatmeal/40" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="w-full px-4 pb-4 overflow-hidden"
                      >
                        <div className="pt-3 border-t border-oatmeal/10 flex flex-col gap-4">
                          <div>
                            <span className="text-[10px] text-amber uppercase font-mono tracking-widest">Тінь / Тригер</span>
                            <p className="text-sm text-oatmeal/90 mt-1">{shadowTrigger}</p>
                          </div>
                          <div className="bg-sage/10 p-3 rounded-xl border border-sage/20">
                            <span className="text-[10px] text-sage uppercase font-mono tracking-widest">Слово Тотему</span>
                            <p className={`text-sm text-oatmeal font-medium mt-1 ${isAdhdMode ? 'text-base font-bold' : ''}`}>{totemAdvice}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
