import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Activity, Brain, Loader2, Download, AlertTriangle, Swords } from "lucide-react";
import { toPng } from "html-to-image";
import { MOCK_SCENARIOS } from "@/data/scenarios";
import { DigitizedMetrics } from "@/components/report/DigitizedMetrics";
import { SomaticProtocol } from "@/components/report/SomaticProtocol";
import { BodyEnergyMap } from "@/components/report/BodyEnergyMap";
import { FractalDecisionMatrix } from "@/components/report/FractalDecisionMatrix";
import { AudioPill } from "@/components/ui/AudioPill";
import { IntakeEngine } from "@/components/intake/IntakeEngine";
import { MainMenu } from "@/components/menu/MainMenu";
import { SHADOWS_DATABASE } from "@/data/shadowsDatabase";
import type { LifeContext, SubSituation, BioParameters } from "@/data/intake/IntakeTypes";
import type { MenuBranch } from "@/data/menu/MenuData";

const CausalChain3D = lazy(() => import("@/components/report/CausalChain3D").then(m => ({ default: m.CausalChain3D })));
const NeuralGraph3D = lazy(() => import("@/components/report/NeuralGraph3D").then(m => ({ default: m.NeuralGraph3D })));
const NegotiationSimulator = lazy(() => import("@/components/negotiation/NegotiationSimulator").then(m => ({ default: m.NegotiationSimulator })));

export function TerminalTab({ isAdhdMode }: { isAdhdMode: boolean }) {
  const [stage, setStage] = useState<"onboarding" | "intake" | "voice-input" | "analysis" | "simulation" | "negotiation" | "explain">("onboarding");
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [matrixData, setMatrixData] = useState<any[]>(MOCK_SCENARIOS);

  useEffect(() => {
    fetch('/matrix.json')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No matrix found');
      })
      .then(data => {
        if (data && data.length > 0) setMatrixData(data);
      })
      .catch(() => console.log('Using default mock scenarios'));
  }, []);

  const activeScenario = stage === "simulation" 
    ? matrixData[activeScenarioIdx] 
    : (aiResult || matrixData[0]);

  const handleIntakeComplete = async (result: {
    context: LifeContext;
    situation: SubSituation;
    freeText: string;
    bioParameters: BioParameters;
  }) => {
    setIsAnalyzing(true);
    setStage("voice-input"); // show loading state
    
    try {
      let telegramId = null;
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
        telegramId = String((window as any).Telegram.WebApp.initDataUnsafe.user.id);
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: result.freeText || "",
          situationText: result.situation.text,
          context: result.context,
          bioParams: result.bioParameters,
          isAdhdMode,
          telegramId,
        }),
      });
      
      if (!res.ok) throw new Error("Помилка аналізу");
      
      const data = await res.json();
      setAiResult({
        ...data,
        description: result.situation.text + (result.freeText ? ` ${result.freeText}` : ""),
        category: "Персональний Аналіз",
      });
      setStage("analysis");
    } catch (err) {
      console.error(err);
      alert("Помилка синхронізації з ядром.");
      setStage("intake");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMicClick = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      let telegramId = null;
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
        telegramId = String((window as any).Telegram.WebApp.initDataUnsafe.user.id);
      }
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText, isAdhdMode, telegramId }),
      });
      if (!res.ok) throw new Error("Помилка аналізу");
      const data = await res.json();
      setAiResult({ ...data, description: inputText, category: "Персональний Аналіз" });
      setStage("analysis");
    } catch (err) {
      console.error(err);
      alert("Помилка синхронізації з ядром.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBranchSelect = (branch: MenuBranch) => {
    switch (branch.engine) {
      case "intake":
        setStage("intake");
        break;
      case "negotiation":
        setStage("negotiation");
        break;
      case "family":
        setStage("intake");
        break;
      case "explain":
        setStage("intake");
        break;
    }
  };

  const handleDownloadReport = async () => {
    if (reportRef.current) {
      try {
        const dataUrl = await toPng(reportRef.current, { cacheBust: true, backgroundColor: '#0D0F12' });
        const link = document.createElement('a');
        link.download = `neural_report_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to download image", err);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pb-48">
      <AnimatePresence mode="wait">
        
        {/* MAIN MENU */}
        {stage === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <MainMenu
              isAdhdMode={isAdhdMode}
              onSelectBranch={handleBranchSelect}
              onSimulation={() => setStage("simulation")}
            />
          </motion.div>
        )}


        {/* STRUCTURED INTAKE */}
        {stage === "intake" && (
          <motion.div
            key="intake"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md pb-12"
          >
            <IntakeEngine onComplete={handleIntakeComplete} isAdhdMode={isAdhdMode} />
          </motion.div>
        )}

        {/* NEGOTIATION SIMULATOR */}
        {stage === "negotiation" && (
          <motion.div
            key="negotiation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <Suspense fallback={<div className="w-full h-32 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-ocean" /></div>}>
              <NegotiationSimulator isAdhdMode={isAdhdMode} onBack={() => setStage("onboarding")} />
            </Suspense>
          </motion.div>
        )}

        {/* VOICE/TEXT INPUT (loading / fallback) */}
        {stage === "voice-input" && (
          <motion.div
            key="voice-input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md flex flex-col items-center justify-center min-h-[70vh]"
          >
            <p className="text-oatmeal/60 mb-8 text-center text-lg font-sans px-4">
              Що тебе турбує або від чого ти втікаєш?
            </p>

            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Опишіть ситуацію..."
              className="w-full h-32 bg-oatmeal/5 border border-oatmeal/10 rounded-[20px] p-4 text-oatmeal focus:outline-none focus:border-ocean mb-8 resize-none shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
              disabled={isAnalyzing}
            />

            <div className="relative w-48 h-48 flex items-center justify-center">
              {isAnalyzing && (
                <>
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-ocean/20 blur-2xl"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute inset-4 rounded-full border border-ocean/50"
                    animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  />
                </>
              )}
              
              <motion.button
                onClick={handleMicClick}
                disabled={isAnalyzing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  scale: isAnalyzing ? [1, 1.02, 1] : 1,
                  boxShadow: isAnalyzing 
                    ? ["0px 0px 0px rgba(106,156,187,0)", "0px 0px 60px rgba(106,156,187,0.6)", "0px 0px 0px rgba(106,156,187,0)"]
                    : "0px 20px 40px rgba(0,0,0,0.3), inset 0px 1px 1px rgba(255,255,255,0.1)"
                }}
                transition={{ repeat: isAnalyzing ? Infinity : 0, duration: 2, ease: "easeInOut" }}
                className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 backdrop-blur-2xl transition-all duration-700 ${isAnalyzing ? 'bg-ocean border-none text-graphite' : 'bg-oatmeal/10 border border-oatmeal/20 text-oatmeal hover:bg-oatmeal/20'}`}
              >
                {isAnalyzing ? <Loader2 size={40} className="animate-spin" /> : <Mic size={40} />}
              </motion.button>
            </div>
            
            {isAnalyzing && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-ocean text-xs font-mono tracking-widest uppercase flex flex-col items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ocean animate-ping" />
                  Сканування Архетипів...
                </span>
                <span className="text-oatmeal/40">Інтеграція Polyvagal & Юнга</span>
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ANALYSIS RESULTS (GRAND UNIFIED SCHEMA) */}
        {(stage === "analysis" || stage === "simulation") && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md flex flex-col items-center space-y-6 pt-4"
          >
            <div ref={reportRef} className="w-full flex flex-col items-center space-y-6 bg-graphite p-4 rounded-3xl">
            {stage === "simulation" && (
              <div className="w-full flex justify-between items-center pb-4 text-xs font-mono text-sage uppercase tracking-widest border-b border-oatmeal/10">
                <button onClick={() => setStage("onboarding")} className="hover:text-oatmeal transition-colors">&lt; Вихід</button>
                <span>Симуляція {activeScenarioIdx + 1}/{matrixData.length}</span>
              </div>
            )}

            {/* Блок 1: Датчики Біо-Впливу & Ідентичність */}
            <div className={`w-full rounded-[24px] p-5 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.2)] ${activeScenario.isHappy ? 'bg-ocean/10 border border-ocean/20' : 'bg-amber/5 border border-amber/10'}`}>
              <Activity size={24} className={activeScenario.isHappy ? "text-ocean mb-3" : "text-amber mb-3"} />
              <p className={`text-[10px] font-mono tracking-widest uppercase mb-1 ${activeScenario.isHappy ? 'text-ocean/70' : 'text-amber/70'}`}>
                {activeScenario.isHappy ? 'Ясність розуму. Парасимпатика' : 'Викид кортизолу. Режим Бий/Біжи'}
              </p>
              <h2 className="text-sm text-oatmeal font-bold text-center leading-tight mb-1">
                {activeScenario.nervousSystemState}
              </h2>
              <p className="text-xs text-oatmeal/60 font-mono">
                {activeScenario.identityArchetype}
              </p>
            </div>

            {/* Блок 1.5: Оцифровані Прогрес Бари */}
            <DigitizedMetrics biometrics={activeScenario.biometrics} isAdhdMode={isAdhdMode} />

            <p className={`text-lg leading-relaxed text-center italic ${isAdhdMode ? 'text-oatmeal font-bold' : 'text-oatmeal/80 font-light'}`}>
              "{activeScenario.description}"
            </p>

            {/* Блок 2: Аналіз Юнга & IFS (Тінь) */}
            <div className={`w-full relative overflow-hidden rounded-[24px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] ${isAdhdMode ? 'bg-amber/10 border-2 border-amber/50' : 'bg-graphite/50 border border-oatmeal/10'}`}>
              <div className="relative z-10">
                <p className={`text-xs mb-3 flex items-center gap-2 ${isAdhdMode ? 'text-amber font-bold uppercase tracking-widest' : 'text-oatmeal/50 font-mono uppercase tracking-widest'}`}>
                  <Brain size={14} />
                  Голос Тіні ({activeScenario.shadowTrigger})
                </p>
                <p className={`leading-relaxed ${isAdhdMode ? 'text-lg text-oatmeal font-bold' : 'text-base text-oatmeal'}`}>
                  "{activeScenario.deficiencyMarker}"
                </p>
              </div>
            </div>

            {/* Блок 2.5: RSD Тригер (тільки якщо він є) */}
            {activeScenario.rsdTrigger && activeScenario.rsdTrigger !== "Відсутній" && (
              <div className="w-full relative overflow-hidden rounded-[24px] p-4 bg-red-900/10 border border-red-500/20">
                <p className="text-[10px] mb-1 text-red-400 font-mono uppercase tracking-widest">RSD Trigger (Страх відторгнення)</p>
                <p className="text-sm text-red-200/90 font-medium">{activeScenario.rsdTrigger}</p>
              </div>
            )}

            {/* Блок 3: Слово Тотему */}
            <div className={`w-full relative overflow-hidden rounded-[24px] p-5 ${isAdhdMode ? 'bg-sage/20 border border-sage/50' : 'bg-sage/10'}`}>
              <p className={`text-xs mb-2 ${isAdhdMode ? 'text-sage font-bold uppercase tracking-widest' : 'text-sage/60 font-mono uppercase tracking-widest'}`}>
                Слово Тотему (Self)
              </p>
              <p className={`${isAdhdMode ? 'text-lg text-oatmeal font-bold' : 'text-sm text-oatmeal/90'}`}>
                {activeScenario.totemAdvice}
              </p>
            </div>

            {/* Блок 3.5: Вектор Наслідків */}
            {activeScenario.consequences && (
              <div className="w-full relative overflow-hidden rounded-[24px] p-5 bg-red-900/20 border border-red-500/30">
                <p className="text-[10px] mb-2 text-red-400 font-mono uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} /> Наслідки руйнування Тіні
                </p>
                <p className={`text-sm text-red-200/90 font-medium leading-relaxed`}>
                  {activeScenario.consequences}
                </p>
              </div>
            )}

            {/* Блок 3.8: Соматичний Протокол (БАДи та Вправи) */}
            <SomaticProtocol interventions={activeScenario.somaticInterventions} />

            {/* Блок 3.9: Соматична Карта Енергії */}
            <BodyEnergyMap somaticMap={activeScenario.somaticMap} />

            {/* Блок 4: Матриця П'ю (3D Фрактал) */}
            <FractalDecisionMatrix vectors={activeScenario.vectors} />

            {/* Блок 4.5: 3D Причинно-Наслідковий Ланцюг */}
            {activeScenario.causalChain && (
              <Suspense fallback={<div className="w-full h-24 flex items-center justify-center"><Loader2 size={20} className="animate-spin text-ocean/40" /></div>}>
                <CausalChain3D data={activeScenario.causalChain} isAdhdMode={isAdhdMode} />
              </Suspense>
            )}

            {/* Блок 4.7: Нейронний Граф Тіней */}
            {activeScenario.shadowTrigger && (
              <Suspense fallback={<div className="w-full h-24 flex items-center justify-center"><Loader2 size={20} className="animate-spin text-red-400/40" /></div>}>
                <NeuralGraph3D
                  activeShadows={SHADOWS_DATABASE.map(s => ({
                    shadow: s,
                    intensity: s.id === (activeScenario.shadowTrigger?.split(" ")[0]?.toLowerCase() || "")
                      ? 85
                      : s.phrases.some((p: string) => activeScenario.deficiencyMarker?.includes(p.slice(0, 10)))
                      ? 55
                      : s.intensityDefault * 0.4,
                  })).filter(s => s.intensity > 20)}
                  primaryShadowId={activeScenario.shadowTrigger?.split(" ")[0]?.toLowerCase() || "escapist"}
                  isAdhdMode={isAdhdMode}
                />
              </Suspense>
            )}

            {/* Блок 4.9: Когнітивне Упередження */}
            {activeScenario.detectedBias && (
              <div className="w-full rounded-[24px] p-5 bg-purple-500/5 border border-purple-500/15">
                <p className="text-[10px] text-purple-400 font-mono uppercase tracking-widest mb-2">
                  Когнітивне упередження
                </p>
                <p className={`font-bold mb-1 ${isAdhdMode ? 'text-base text-oatmeal' : 'text-sm text-oatmeal/90'}`}>
                  {activeScenario.detectedBias.name}
                </p>
                <p className="text-xs text-oatmeal/60 mb-2">{activeScenario.detectedBias.description}</p>
                <p className="text-xs text-sage/80 italic">{activeScenario.detectedBias.counterStrategy}</p>
              </div>
            )}

            {/* Блок 5: Архітектура Профіциту */}
            <div className={`w-full p-6 rounded-[24px] shadow-[0_10px_40px_rgba(106,156,187,0.05)] text-center mb-8 ${isAdhdMode ? 'bg-ocean/20 border-2 border-ocean' : 'bg-ocean/10'}`}>
              <span className={`text-xs block mb-3 font-mono tracking-widest uppercase ${isAdhdMode ? 'text-ocean font-bold' : 'text-ocean/70'}`}>
                Архітектура Профіциту
              </span>
              <p className={`leading-relaxed ${isAdhdMode ? 'text-lg text-oatmeal font-bold' : 'text-base text-oatmeal font-light'}`}>
                {activeScenario.abundanceResolution}
              </p>
            </div>
            </div> {/* End of reportRef */}

            {/* Actions (Outside the image capture area) */}
            <div className="w-full flex gap-2">
              <button 
                onClick={handleDownloadReport}
                className="flex-1 py-4 mt-2 rounded-[24px] bg-ocean/20 text-ocean font-mono tracking-widest hover:bg-ocean/30 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} /> ЗБЕРЕГТИ
              </button>
              {stage === "simulation" ? (
                <button 
                  onClick={() => setActiveScenarioIdx((prev) => (prev + 1) % matrixData.length)}
                  className="flex-1 py-4 mt-2 rounded-[24px] bg-oatmeal/10 text-oatmeal font-mono tracking-widest hover:bg-oatmeal/20 transition-colors"
                >
                  НАСТУПНА
                </button>
              ) : (
                <button 
                  onClick={() => { setInputText(""); setAiResult(null); setStage("intake"); }}
                  className="flex-1 text-oatmeal/40 hover:text-oatmeal text-sm py-4 transition-colors font-mono tracking-widest"
                >
                  НОВИЙ ДІАГНОЗ
                </button>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {(stage === "analysis" || stage === "simulation") && (
          <AudioPill 
            frequency={activeScenario.isHappy ? 432 : 396} 
            description={activeScenario.isHappy ? "Вентральний ритм (Гармонія)" : "Дорсальний вихід (Vagus Nerve)"} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
