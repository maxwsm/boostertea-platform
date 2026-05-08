"use client";

import { useState } from "react";
import { AuthGate } from "@/components/ui/AuthGate";
import { TerminalTab } from "@/components/tabs/TerminalTab";
import { MassagerTab } from "@/components/tabs/MassagerTab";
import { MusicTab } from "@/components/tabs/MusicTab";
import { HistoryTab } from "@/components/tabs/HistoryTab";
import { CodexTab } from "@/components/tabs/CodexTab";
import { Terminal, Hexagon, Headphones, User, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"terminal" | "massager" | "music" | "history" | "codex">("terminal");
  const [isAdhdMode, setIsAdhdMode] = useState(false);

  return (
    <AuthGate>
      <main className="flex min-h-screen flex-col relative bg-graphite text-oatmeal overflow-hidden">
        
        {/* Global Header */}
        <div className="absolute top-4 right-4 z-50 flex items-center">
          <button 
            onClick={() => setIsAdhdMode(!isAdhdMode)}
            className="flex items-center gap-3 p-2 min-h-[44px] cursor-pointer rounded-[24px] hover:bg-white/5 transition-colors"
          >
            <span className={`text-[10px] font-mono tracking-widest uppercase transition-colors duration-500 ${isAdhdMode ? 'text-amber font-bold' : 'text-oatmeal/40'}`}>
              РДУГ
            </span>
            <div className={`w-12 h-6 rounded-full relative transition-all duration-500 border overflow-hidden ${isAdhdMode ? 'bg-amber/20 border-amber/50 shadow-[0_0_15px_rgba(255,191,0,0.3)]' : 'bg-oatmeal/5 border-oatmeal/20 backdrop-blur-md'}`}>
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`absolute top-1 bottom-1 w-4 rounded-full transition-colors duration-500 ${isAdhdMode ? 'bg-amber left-[26px]' : 'bg-oatmeal/40 left-1'}`} 
              />
            </div>
          </button>
        </div>

        {/* Active Tab Content */}
        <div className="flex-1 w-full overflow-y-auto">
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
        </div>

        {/* Premium Floating Dock */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div 
            className="flex items-center gap-2 p-2 rounded-[32px] bg-graphite/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
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
                  <Icon size={24} className={`relative z-10 transition-colors duration-500 ${isActive ? tab.color : 'text-oatmeal/40'}`} />
                </button>
              );
            })}
          </motion.div>
        </div>

      </main>
    </AuthGate>
  );
}
