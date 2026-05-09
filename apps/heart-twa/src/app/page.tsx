"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { AuthGate } from "@/components/ui/AuthGate";
import { TerminalTab } from "@/components/tabs/TerminalTab";
import { MassagerTab } from "@/components/tabs/MassagerTab";
import { MusicTab } from "@/components/tabs/MusicTab";
import { HistoryTab } from "@/components/tabs/HistoryTab";
import { CodexTab } from "@/components/tabs/CodexTab";
import { WelcomeOnboarding } from "@/components/onboarding/WelcomeOnboarding";
import { ValueSyncModal } from "@/components/ui/ValueSyncModal";
import { Terminal, Hexagon, Headphones, User, BookOpen, Eye, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { Gamepad2 } from "lucide-react";

const VisionCalibration = lazy(() => import("@/components/vision/VisionCalibration").then(m => ({ default: m.VisionCalibration })));

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default function Home() {
  const [activeTab, setActiveTab] = useState<"terminal" | "massager" | "music" | "history" | "codex">("terminal");
  const [isAdhdMode, setIsAdhdMode] = useState(false);
  const [showVision, setShowVision] = useState(false);

  // Re-entry flow: vision → welcome → app
  const [reEntryPhase, setReEntryPhase] = useState<"checking" | "vision" | "welcome" | "ready">("checking");
  const [showValueSync, setShowValueSync] = useState(false);

  useEffect(() => {
    const handleShowValueSync = () => setShowValueSync(true);
    window.addEventListener("mrrt:showValueSync", handleShowValueSync);
    return () => window.removeEventListener("mrrt:showValueSync", handleShowValueSync);
  }, []);

  useEffect(() => {
    const lastVisit = localStorage.getItem("mrrt_last_visit");
    const now = Date.now();
    const isFirstVisit = !lastVisit;
    const isLongAbsence = lastVisit && (now - parseInt(lastVisit, 10)) > THREE_DAYS_MS;

    if (isFirstVisit || isLongAbsence) {
      setReEntryPhase("vision");
    } else {
      setReEntryPhase("ready");
    }
    // Always update last visit
    localStorage.setItem("mrrt_last_visit", now.toString());
  }, []);

  const handleVisionClose = () => {
    setReEntryPhase("welcome");
    setShowVision(false);
  };

  const handleWelcomeComplete = () => {
    setReEntryPhase("ready");
  };

  return (
    <AuthGate>
      <main className="flex min-h-screen flex-col relative overflow-hidden" style={{ backgroundColor: "var(--v-bg)", color: "var(--v-text)" }}>
        
        {/* Global Header — hidden during onboarding */}
        {reEntryPhase === "ready" && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setShowValueSync(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md hover:opacity-80 transition-all"
            style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}
          >
            <Scale size={16} style={{ color: "var(--v-text-dim)" }} />
          </button>
          <button
            onClick={() => setShowVision(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md hover:opacity-80 transition-all"
            style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}
          >
            <Eye size={16} style={{ color: "var(--v-text-dim)" }} />
          </button>
          <Link href="/simulator" className="flex items-center gap-2 p-2 min-h-[44px] rounded-[24px] backdrop-blur-md hover:opacity-80 transition-all" style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)", color: "var(--v-accent)" }}>
            <Gamepad2 size={18} />
            <span className="text-[10px] font-mono tracking-widest uppercase">Simulator</span>
          </Link>
          <button 
            onClick={() => setIsAdhdMode(!isAdhdMode)}
            className="flex items-center gap-3 p-2 min-h-[44px] cursor-pointer rounded-[24px] hover:bg-white/5 transition-colors"
          >
            <span className={`text-[10px] font-mono tracking-widest uppercase transition-colors duration-500 ${isAdhdMode ? 'text-amber font-bold' : ''}`} style={{ color: isAdhdMode ? undefined : "var(--v-text-dim)" }}>
              РДУГ
            </span>
            <div className={`w-12 h-6 rounded-full relative transition-all duration-500 border overflow-hidden ${isAdhdMode ? 'bg-amber/20 border-amber/50 shadow-[0_0_15px_rgba(255,191,0,0.3)]' : ''}`} style={isAdhdMode ? {} : { backgroundColor: "var(--v-bg-input)", borderColor: "var(--v-border)" }}>
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`absolute top-1 bottom-1 w-4 rounded-full transition-colors duration-500 ${isAdhdMode ? 'bg-amber left-[26px]' : 'bg-oatmeal/40 left-1'}`} 
              />
            </div>
          </button>
        </div>
        )}


        {/* Active Tab Content OR Welcome Onboarding */}
        <div className="flex-1 w-full overflow-y-auto">
          {reEntryPhase === "welcome" ? (
            <WelcomeOnboarding onComplete={handleWelcomeComplete} />
          ) : reEntryPhase === "ready" ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {activeTab === "terminal" && <TerminalTab isAdhdMode={isAdhdMode} />}
                {activeTab === "massager" && <MassagerTab isAdhdMode={isAdhdMode} />}
                {activeTab === "music" && <MusicTab isAdhdMode={isAdhdMode} />}
                {activeTab === "history" && <HistoryTab isAdhdMode={isAdhdMode} />}
                {activeTab === "codex" && <CodexTab isAdhdMode={isAdhdMode} />}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>

        {/* Premium Floating Dock — hidden during onboarding */}
        {reEntryPhase === "ready" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div 
            className="flex items-center gap-2 p-2 rounded-[32px] backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            style={{ backgroundColor: "color-mix(in srgb, var(--v-bg) 70%, transparent)", border: "1px solid var(--v-border)" }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {[
              { id: "terminal", icon: Terminal, color: "text-sage" },
              { id: "massager", icon: Hexagon, color: "text-ocean" },
              { id: "music", icon: Headphones, color: "text-amber" },
              { id: "history", icon: User, color: "text-white" },
              { id: "codex", icon: BookOpen, color: "text-red-400" }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-full bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={24} className={`relative z-10 transition-colors duration-500 ${isActive ? tab.color : ''}`} style={isActive ? {} : { color: "var(--v-text-dim)" }} />
                </button>
              );
            })}
          </motion.div>
        </div>
        )}

        {/* Vision Calibration Modal — re-entry or manual */}
        <AnimatePresence>
          {(showVision || reEntryPhase === "vision") && (
            <Suspense fallback={null}>
              <VisionCalibration onClose={reEntryPhase === "vision" ? handleVisionClose : () => setShowVision(false)} />
            </Suspense>
          )}
        </AnimatePresence>

        <ValueSyncModal isOpen={showValueSync} onClose={() => setShowValueSync(false)} />

      </main>
    </AuthGate>
  );
}
