"use client";
import React, { useState } from "react";
import { createInitialPlayer, PlayerState, FUNDING_INSTRUMENTS, FundingType, calculateHourCost, calculateCurrentNetworth, getMindsetFromBanks } from "@/data/game-simulator/rules";
import { GAME_STEPS, MULTIPLIERS, createEmptyForm, OnboardingForm, getRandomPuzzle, LogicPuzzle } from "@/data/game-simulator/gameFlow";
import { DESIRE_ACTIONS, processDesireAction, BASIC_NEEDS, processBasicNeed, analyzeGoal, ActionResult } from "@/data/game-simulator/assetNodes";
import { BUSINESS_MODELS, getMonthlyProfit } from "@/data/game-simulator/businesses";
import { rollMonthlyEvents, applyCipollaCategory } from "@/data/game-simulator/blackSwans";
import { generateDebrief } from "@/data/game-simulator/debrief";
import { createScienceTracker, ScienceTracker, investLossInScience, SCIENCE_TOPICS, generateRevelation, getVisibleAction } from "@/data/game-simulator/scienceEasterEgg";
import { getRandomCase, EVENT_TO_CASE_MAP, RealCase } from "@/data/game-simulator/realCases";
import { CIPOLLA_SCALE_CASES, CipollaScaleCase } from "@/data/game-simulator/cipollaScaleMatrix";
import { Brain, Heart, DollarSign, Activity, AlertTriangle, Gamepad2, ChevronRight, Shield, Target, Zap, BookOpen, GraduationCap, Scale } from "lucide-react";

type Phase = "ONBOARDING" | "FUNDING" | "PLAYING" | "EVENT" | "PUZZLE" | "SCIENCE_PICK" | "DEBRIEF";

export default function SimulatorPage() {
  const [phase, setPhase] = useState<Phase>("ONBOARDING");
  const [form, setForm] = useState<OnboardingForm>(createEmptyForm());
  const [player, setPlayer] = useState<PlayerState>(createInitialPlayer("Гравець"));
  const [step, setStep] = useState(0);
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);
  const [pendingPuzzle, setPendingPuzzle] = useState<LogicPuzzle | null>(null);
  const [isNeuroMode, setIsNeuroMode] = useState(false);
  const [scienceTracker, setScienceTracker] = useState<ScienceTracker>(createScienceTracker());
  const [pendingLoss, setPendingLoss] = useState<number>(0);
  const [currentScaleCase, setCurrentScaleCase] = useState<CipollaScaleCase | null>(null);
  const [currentRealCase, setCurrentRealCase] = useState<RealCase | null>(null);

  const mental = player.banks.MENTAL.balance;
  const cash = player.banks.FINANCIAL.balance;
  const social = player.banks.SOCIAL.balance;
  const mindset = getMindsetFromBanks(mental);
  const networth = calculateCurrentNetworth(player);

  const applyResult = (r: ActionResult) => {
    setPlayer(p => ({
      ...p,
      banks: {
        ...p.banks,
        FINANCIAL: { ...p.banks.FINANCIAL, balance: Math.max(0, p.banks.FINANCIAL.balance + r.financialDelta) },
        MENTAL: { ...p.banks.MENTAL, balance: Math.max(0, Math.min(100, p.banks.MENTAL.balance + r.mentalDelta)) },
        SOCIAL: { ...p.banks.SOCIAL, balance: Math.max(0, Math.min(100, p.banks.SOCIAL.balance + r.socialDelta)) },
      },
      actionLog: [...p.actionLog, { month: p.month, action: r.title, financialDelta: r.financialDelta, mentalDelta: r.mentalDelta, socialDelta: r.socialDelta, mindset: r.mindset, lesson: r.lesson }],
    }));
    setLastResult(r);
    if (r.isBlackSwan) {
      setPendingPuzzle(getRandomPuzzle());
      setPhase("PUZZLE");
    }
  };

  const nextStep = () => {
    if (step >= 12) { setPhase("DEBRIEF"); return; }
    setStep(s => s + 1);
    setLastResult(null);
    setPlayer(p => ({ ...p, month: p.month + 1 }));
    const events = rollMonthlyEvents(player);
    if (events.npcEvent) {
      const e = events.npcEvent;
      const canMitigate = player.awarenessLevel >= e.awarenessRequiredToAvoid && e.mitigatedOutcome;
      const impact = canMitigate ? e.mitigatedOutcome! : e;
      applyResult({
        financialDelta: (canMitigate ? impact.financialImpactMultiplier : e.financialImpactMultiplier) * cash,
        mentalDelta: canMitigate ? impact.mentalImpact : e.mentalImpact,
        socialDelta: e.socialImpact,
        mindset: e.category === "STUPID" || e.category === "BANDIT" ? "DEFICIT" : "PROFICIT",
        title: `${applyCipollaCategory(e.category)}: ${e.title}`,
        message: canMitigate ? (impact as any).message : e.description,
        lesson: e.lesson,
        isBlackSwan: e.category === "STUPID",
      });
      setPhase("EVENT");
    }
  };

  const takeFunding = (type: FundingType) => {
    const f = FUNDING_INSTRUMENTS[type];
    setPlayer(p => ({
      ...p,
      banks: {
        ...p.banks,
        FINANCIAL: { ...p.banks.FINANCIAL, balance: p.banks.FINANCIAL.balance + f.availableAmount },
        MENTAL: { ...p.banks.MENTAL, balance: Math.max(0, p.banks.MENTAL.balance - f.upfrontMentalCost) },
      },
      monthlyDebts: f.monthlyInterestRate > 0 ? [...p.monthlyDebts, {
        source: type, originalAmount: f.availableAmount, remainingAmount: f.availableAmount,
        monthlyPayment: f.availableAmount * (f.monthlyInterestRate / 100), monthlyMentalCost: f.monthlyMentalCost, monthsRemaining: 24,
      }] : p.monthlyDebts,
    }));
    setPhase("PLAYING");
  };

  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;

  // ═══ RENDER ═══════════════════════════════
  return (
    <div className={`min-h-screen bg-[#0D0F12] text-[#F5F5F0] p-5 pb-24 font-sans ${isNeuroMode ? "tracking-wide" : ""}`}>
      {/* Neuro toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-[#00FF88] to-[#FF9500] bg-clip-text text-transparent">
          PROFICIT
        </h1>
        <button onClick={() => setIsNeuroMode(!isNeuroMode)} className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all ${isNeuroMode ? "bg-amber-500/20 border-amber-500/50 text-amber-400" : "bg-white/5 border-white/10 text-white/40"}`}>
          {isNeuroMode ? "🧠 РДУГ ON" : "РДУГ"}
        </button>
      </div>

      {/* Step indicator */}
      {phase !== "ONBOARDING" && phase !== "DEBRIEF" && (
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            {GAME_STEPS.map((s, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < step ? "bg-[#00FF88]" : i === step ? "bg-[#FF9500]" : "bg-white/10"}`} />
            ))}
          </div>
          <p className="text-[10px] text-white/40 font-mono">Крок {step + 1}/13: {GAME_STEPS[step]?.title}</p>
        </div>
      )}

      {/* HUD Banks */}
      {phase !== "ONBOARDING" && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[9px] text-white/40 uppercase font-mono flex items-center gap-1"><DollarSign size={10}/> Фінанси</div>
            <div className="text-lg font-black">${Math.floor(cash)}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[9px] text-white/40 uppercase font-mono flex items-center gap-1"><Heart size={10} className="text-[#00FF88]"/> Менталка</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-1"><div className="h-2 rounded-full transition-all" style={{width:`${mental}%`, background: mental > 60 ? "#00FF88" : mental > 30 ? "#FF9500" : "#FF4444"}} /></div>
            <div className="text-[10px] mt-1 font-mono" style={{color: mental > 60 ? "#00FF88" : mental > 30 ? "#FF9500" : "#FF4444"}}>{mental}%</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[9px] text-white/40 uppercase font-mono flex items-center gap-1"><Shield size={10} className="text-blue-400"/> Соціальний</div>
            <div className="text-lg font-black">{social}</div>
          </div>
        </div>
      )}

      {/* ── ONBOARDING ─────────────────────── */}
      {phase === "ONBOARDING" && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Gamepad2 size={48} className="mx-auto text-[#FF9500] mb-4" />
            <p className={cls("text-white/60")}>Визнач свій вектор перед стартом. Відповіді формують індивідуальну лінію подій.</p>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs text-white/50 uppercase font-mono">1. Напрямок</span>
              <div className="flex gap-2 mt-2">
                {(["PRODUCTION","SERVICES","RETAIL"] as const).map(d => (
                  <button key={d} onClick={() => setForm(f => ({...f, direction: d}))} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${form.direction === d ? "bg-[#00FF88]/15 border-[#00FF88]/50 text-[#00FF88]" : "bg-white/5 border-white/10 text-white/50"}`}>
                    {d === "PRODUCTION" ? "🏭 Виробництво" : d === "SERVICES" ? "💼 Послуги" : "🛒 Рітейл"}
                  </button>
                ))}
              </div>
            </label>
            <label className="block">
              <span className="text-xs text-white/50 uppercase font-mono">2. Ніша</span>
              <input value={form.niche} onChange={e => setForm(f => ({...f, niche: e.target.value}))} placeholder="Наприклад: чайні концентрати для HoReCa" className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50" />
            </label>
            <label className="block">
              <span className="text-xs text-white/50 uppercase font-mono">3. Мотивація (чому саме це?)</span>
              <textarea value={form.motivation} onChange={e => setForm(f => ({...f, motivation: e.target.value}))} placeholder="Що рухає тобою?" className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 h-20 resize-none" />
            </label>
            <label className="block">
              <span className="text-xs text-white/50 uppercase font-mono">5. Фінансова мета ($)</span>
              <input type="number" value={form.financialGoal} onChange={e => setForm(f => ({...f, financialGoal: +e.target.value}))} className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF9500]/50" />
            </label>
            <label className="block">
              <span className="text-xs text-white/50 uppercase font-mono">6. Особиста мета</span>
              <input value={form.personalGoal} onChange={e => setForm(f => ({...f, personalGoal: e.target.value}))} placeholder="Що ти хочеш відчувати?" className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none" />
            </label>
          </div>
          <button onClick={() => { setPlayer(p => ({...p, goalCostUSD: form.financialGoal, goalDescription: form.personalGoal})); setPhase("FUNDING"); }} disabled={!form.direction || !form.niche} className="w-full py-4 bg-[#00FF88] text-black font-black uppercase tracking-widest rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]">
            Почати Гру →
          </button>
        </div>
      )}

      {/* ── FUNDING ────────────────────────── */}
      {phase === "FUNDING" && (
        <div className="space-y-4">
          <h2 className={cls("font-bold text-white")}>Крок 8: Обери джерело капіталу</h2>
          <p className="text-xs text-white/40">Кожне джерело має ціну — не лише фінансову.</p>
          {Object.values(FUNDING_INSTRUMENTS).map(f => (
            <button key={f.id} onClick={() => takeFunding(f.id)} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <div className="font-bold text-white mb-1">{f.name}</div>
              <div className="text-xs text-white/50 mb-2">{f.description}</div>
              <div className="flex gap-3 text-[10px] font-mono">
                <span className="text-[#00FF88]">+${f.availableAmount}</span>
                {f.monthlyInterestRate > 0 && <span className="text-[#FF4444]">{f.monthlyInterestRate}%/міс</span>}
                <span className="text-[#FF9500]">Менталка: -{f.monthlyMentalCost}/міс</span>
              </div>
              <ul className="mt-2 space-y-1">{f.tradeoffs.slice(0,2).map((t,i) => <li key={i} className="text-[10px] text-white/30">• {t}</li>)}</ul>
            </button>
          ))}
        </div>
      )}

      {/* ── PLAYING ────────────────────────── */}
      {phase === "PLAYING" && (
        <div className="space-y-4">
          {lastResult && (
            <div className={`p-4 rounded-xl border ${lastResult.mindset === "PROFICIT" ? "bg-[#00FF88]/10 border-[#00FF88]/30" : lastResult.mindset === "DEFICIT" ? "bg-[#FF4444]/10 border-[#FF4444]/30" : "bg-[#FF9500]/10 border-[#FF9500]/30"}`}>
              <p className="text-xs font-bold mb-1">{lastResult.title}</p>
              <p className={cls("text-white/70 mb-2")}>{lastResult.message}</p>
              <div className="flex gap-3 text-[10px] font-mono">
                <span style={{color: lastResult.financialDelta >= 0 ? "#00FF88" : "#FF4444"}}>${lastResult.financialDelta >= 0 ? "+" : ""}{Math.floor(lastResult.financialDelta)}</span>
                <span style={{color: lastResult.mentalDelta >= 0 ? "#00FF88" : "#FF4444"}}>🧠 {lastResult.mentalDelta >= 0 ? "+" : ""}{lastResult.mentalDelta}</span>
              </div>
              {lastResult.lesson && <p className="mt-2 text-[10px] text-white/40 italic border-t border-white/10 pt-2">💡 {lastResult.lesson}</p>}
            </div>
          )}

          <h3 className="text-xs text-white/40 uppercase font-mono tracking-widest">Дії</h3>
          {/* Desires */}
          {DESIRE_ACTIONS.slice(0,2).map(d => (
            <button key={d.id} onClick={() => applyResult(processDesireAction(d, player))} className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <span className="text-xs font-bold text-white">{d.label}</span>
              <span className="text-[10px] text-white/30 ml-2">-${d.cost}</span>
            </button>
          ))}
          {/* Business */}
          {BUSINESS_MODELS.slice(0,2).map(b => (
            <button key={b.id} onClick={() => {
              const profit = getMonthlyProfit(b, 80);
              applyResult({ financialDelta: -b.minInvestmentUSD, mentalDelta: -10, socialDelta: 5, mindset: player.awarenessLevel >= 5 ? "PROFICIT" : "NEUTRAL", title: `Інвестиція: ${b.name}`, message: `Ти придбав ${b.name}. Очікуваний profit: $${Math.floor(profit)}/міс.`, lesson: b.mainRisks[0] });
              setPlayer(p => ({...p, ownedAssets: [...p.ownedAssets, { businessId: b.id, purchasePrice: b.minInvestmentUSD, monthlyRevenue: b.monthlyRevenue.reduce((s,r) => s + r.monthlyUSD, 0), monthlyExpenses: b.monthlyFixedCosts.reduce((s,c) => s + (c.monthlyUSD||0), 0), healthScore: 80 }]}));
            }} disabled={cash < b.minInvestmentUSD} className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-20">
              <span className="text-xs font-bold text-white">{b.icon} {b.name}</span>
              <span className="text-[10px] text-white/30 ml-2">${b.minInvestmentUSD}</span>
            </button>
          ))}

          {/* HIDDEN: Science button — appears ONLY when last result was negative */}
          {lastResult && lastResult.financialDelta < 0 && (
            <button onClick={() => { setPendingLoss(Math.abs(lastResult.financialDelta)); setPhase("SCIENCE_PICK"); }} className="w-full text-left p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
              <span className="text-xs font-bold text-indigo-400">📚 Вкласти збиток в науку / AI</span>
              <span className="text-[10px] text-white/30 ml-2">Ефект невідомий</span>
            </button>
          )}

          <button onClick={nextStep} className="w-full py-4 mt-4 bg-[#FF9500] text-black font-black uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,149,0,0.3)]">
            Наступний Крок →
          </button>
        </div>
      )}

      {/* ── SCIENCE TOPIC PICKER (hidden mechanic) ─ */}
      {phase === "SCIENCE_PICK" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <GraduationCap className="text-indigo-400 mb-2" size={24} />
            <p className="text-xs text-indigo-400 uppercase font-mono mb-2">Перенаправити збиток у навчання</p>
            <p className={cls("text-white/60 mb-4")}>Обери тему. Результат невідомий.</p>
          </div>
          {SCIENCE_TOPICS.map(t => (
            <button key={t.id} onClick={() => {
              setScienceTracker(prev => investLossInScience(prev, pendingLoss, "USD", "loss", t.id, player.month));
              // Neutralize the financial loss silently
              setPlayer(p => ({ ...p, banks: { ...p.banks, FINANCIAL: { ...p.banks.FINANCIAL, balance: p.banks.FINANCIAL.balance + pendingLoss } } }));
              setLastResult({ financialDelta: 0, mentalDelta: 3, socialDelta: 0, mindset: "NEUTRAL", title: `📚 Вивчаєш: ${t.name}`, message: t.description, lesson: "Ефект проявиться пізніше..." });
              setPhase("PLAYING");
            }} className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500/10 transition-all">
              <span className="text-sm">{t.icon} {t.name}</span>
              <p className="text-[10px] text-white/30 mt-1">{t.description}</p>
            </button>
          ))}
          <button onClick={() => setPhase("PLAYING")} className="w-full py-2 text-xs text-white/30">Пропустити</button>
        </div>
      )}

      {/* ── EVENT ──────────────────────────── */}
      {phase === "EVENT" && lastResult && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30">
            <AlertTriangle className="text-red-500 mb-2" size={24} />
            <p className="font-bold text-white mb-1">{lastResult.title}</p>
            <p className={cls("text-white/70 mb-3")}>{lastResult.message}</p>
            <p className="text-[10px] text-white/40 italic border-t border-white/10 pt-2">💡 {lastResult.lesson}</p>
          </div>

          {/* 3-Scale Cipolla Comparison */}
          {(() => {
            const scale = CIPOLLA_SCALE_CASES[Math.floor(Math.random() * CIPOLLA_SCALE_CASES.length)];
            return (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[9px] text-amber-400 uppercase font-mono tracking-widest mb-2">⚖️ Ця помилка на 3 масштабах</p>
                <p className="text-xs font-bold text-white mb-3">{scale.patternName}</p>
                {([scale.scales.small, scale.scales.medium, scale.scales.large] as const).map((s, i) => (
                  <div key={i} className="flex gap-2 items-start mb-2 last:mb-0">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${i === 0 ? 'bg-green-500/20 text-green-400' : i === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{s.level}</span>
                    <div>
                      <p className="text-[10px] text-white/70"><b>{s.realEntity}</b> ({s.year}): {s.loss}</p>
                      <p className="text-[9px] text-white/30">{s.description}</p>
                    </div>
                  </div>
                ))}
                <p className="text-[9px] text-amber-400/70 mt-2 italic border-t border-white/5 pt-2">{scale.cipollaPrinciple}</p>
              </div>
            );
          })()}

          <button onClick={() => setPhase("PLAYING")} className="w-full py-3 bg-white/10 text-white font-bold rounded-xl">Зрозумів, далі →</button>
        </div>
      )}

      {/* ── PUZZLE ─────────────────────────── */}
      {phase === "PUZZLE" && pendingPuzzle && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/30">
            <Zap className="text-[#FF9500] mb-2" size={24} />
            <p className="text-[10px] text-[#FF9500] uppercase font-mono mb-2">Логічна загадка — шанс ліквідувати наслідки</p>
            <p className="text-xs text-white/50 mb-1">{pendingPuzzle.topic}</p>
            <p className={cls("font-bold text-white mb-4")}>{pendingPuzzle.question}</p>
            {pendingPuzzle.options.map((o, i) => (
              <button key={i} onClick={() => {
                if (i === pendingPuzzle.correctIndex) {
                  applyResult({ financialDelta: Math.abs(lastResult?.financialDelta || 0) * 0.5, mentalDelta: 15, socialDelta: 5, mindset: "PROFICIT", title: "✅ Правильно!", message: pendingPuzzle.explanation, lesson: "Знання рятують капітал." });
                } else {
                  applyResult({ financialDelta: 0, mentalDelta: -5, socialDelta: 0, mindset: "DEFICIT", title: "❌ Неправильно", message: pendingPuzzle.explanation, lesson: "Цього разу не вдалося. Наслідки залишаються." });
                }
                setPendingPuzzle(null);
                setPhase("PLAYING");
              }} className="w-full text-left p-3 mb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white/80">
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── DEBRIEF ────────────────────────── */}
      {phase === "DEBRIEF" && (() => {
        const d = generateDebrief(player);
        const revelation = generateRevelation(scienceTracker);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target size={48} className="mx-auto text-[#00FF88] mb-4" />
              <h2 className="text-2xl font-black">{d.overallLabel}</h2>
              <p className="text-4xl font-black text-[#FF9500] mt-2">{d.overallScore}/100</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-white/5 text-center"><p className="text-[9px] text-white/40">Networth</p><p className="font-bold">${Math.floor(d.networth)}</p></div>
              <div className="p-3 rounded-xl bg-white/5 text-center"><p className="text-[9px] text-white/40">$/година</p><p className="font-bold">${d.hourCostNow.toFixed(1)}</p></div>
              <div className="p-3 rounded-xl bg-white/5 text-center"><p className="text-[9px] text-white/40">Менталка</p><p className="font-bold">{d.mentaEnergy}%</p></div>
            </div>
            {d.mindsetPatterns.map(m => (
              <div key={m.type} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{background: m.color}} />
                <span className="text-xs flex-1">{m.label}</span>
                <span className="text-xs font-mono" style={{color: m.color}}>{m.percentage}%</span>
              </div>
            ))}
            {d.insights.slice(0,3).map((ins, i) => (
              <div key={i} className={`p-4 rounded-xl border ${ins.severity === "critical" ? "bg-red-500/10 border-red-500/30" : ins.severity === "warning" ? "bg-[#FF9500]/10 border-[#FF9500]/30" : "bg-[#00FF88]/10 border-[#00FF88]/30"}`}>
                <p className="text-xs font-bold mb-1">{ins.title}</p>
                <p className={cls("text-white/60 mb-2")}>{ins.observation}</p>
                {ins.proficitReframe && <p className="text-[10px] text-[#00FF88] italic">💡 Профіцит: {ins.proficitReframe}</p>}
              </div>
            ))}

            {/* ═══ SCIENCE EASTER EGG REVELATION ═══ */}
            {revelation && (
              <div className="p-5 rounded-xl bg-gradient-to-b from-indigo-500/20 to-purple-500/10 border border-indigo-500/40">
                <GraduationCap size={32} className="text-indigo-400 mb-3" />
                <h3 className="text-sm font-black text-indigo-300 uppercase tracking-widest mb-3">🔓 Пасхалка Розкрита: Сила Науки</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-[9px] text-white/40">Збитків конвертовано</p>
                    <p className="font-bold text-indigo-300">${Math.floor(revelation.totalInvested)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-[9px] text-white/40">Інтелектуальний актив</p>
                    <p className="font-bold text-[#00FF88]">${Math.floor(revelation.totalReturned)}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-[9px] text-white/40 uppercase font-mono mb-1">Прихований трек впевненості</p>
                  <div className="w-full bg-white/10 rounded-full h-2"><div className="h-2 rounded-full bg-indigo-400 transition-all" style={{width: `${revelation.confidenceLevel}%`}} /></div>
                  <p className="text-[10px] text-indigo-300 mt-1">{revelation.confidenceLevel}%</p>
                </div>
                <p className={cls("text-white/70 mb-3")}>{revelation.patternMessage}</p>
                <div className="border-t border-indigo-500/20 pt-3">
                  <p className="text-[10px] text-indigo-300 font-bold uppercase mb-1">Як це працює в житті:</p>
                  <p className="text-[11px] text-white/60 leading-relaxed">{revelation.lifecycleInsight}</p>
                </div>
                {revelation.investedTopics.length > 0 && (
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {revelation.investedTopics.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[9px] text-indigo-300">{t}</span>)}
                  </div>
                )}
              </div>
            )}

            <button onClick={() => { setPhase("ONBOARDING"); setPlayer(createInitialPlayer("Гравець")); setStep(0); setForm(createEmptyForm()); setScienceTracker(createScienceTracker()); }} className="w-full py-4 bg-[#00FF88] text-black font-black uppercase rounded-xl">Нова Гра</button>
          </div>
        );
      })()}
    </div>
  );
}
