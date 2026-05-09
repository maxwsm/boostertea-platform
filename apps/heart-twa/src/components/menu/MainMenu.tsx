"use client";

/**
 * MAIN MENU — Service selection hub
 * 
 * Replaces the old onboarding screen with a structured
 * menu of all available services. Each category expands
 * to show branches with descriptions and example prompts.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Swords, Users, MessageCircle,
  ChevronRight, ChevronDown, Sparkles,
} from "lucide-react";
import { MENU_CATEGORIES, type MenuBranch, type CategoryId } from "@/data/menu/MenuData";

const CATEGORY_ICONS: Record<string, any> = {
  Brain, Swords, Users, MessageCircle,
};

interface MainMenuProps {
  isAdhdMode: boolean;
  onSelectBranch: (branch: MenuBranch) => void;
  onSimulation: () => void;
}

export function MainMenu({ isAdhdMode, onSelectBranch, onSimulation }: MainMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<CategoryId | null>(null);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center px-4 pt-16 pb-12 gap-5">
      {/* Header */}
      <div className="text-center space-y-1 mb-2">
        <h1 className="text-2xl font-sans font-light tracking-tight" style={{ color: "var(--v-text)" }}>
          I3.MRMRRT.ƐI
        </h1>
        <p className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: "var(--v-text-dim)" }}>
          Автономний Тіньовий Стратег
        </p>
      </div>

      {/* Service description */}
      <div className="w-full p-4 rounded-[18px]" style={{ backgroundColor: "var(--v-accent-muted)", border: "1px solid var(--v-border-active)" }}>
        <div className="flex items-start gap-3">
          <Sparkles size={16} style={{ color: "var(--v-accent)", flexShrink: 0, marginTop: 2 }} />
          <p className={`leading-relaxed ${isAdhdMode ? "text-sm font-medium" : "text-xs"}`} style={{ color: "var(--v-text-muted)" }}>
            Математично обґрунтований аналіз ситуацій на перетині нейробіології (Porges, Sapolsky), глибинної психології (Jung, Schwartz) та теорії рішень (Kahneman, Taleb).
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="w-full flex flex-col gap-2">
        {MENU_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.lucideIcon] || Brain;
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="w-full">
              {/* Category header */}
              <motion.button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full flex items-center gap-3 p-4 rounded-[16px] text-left transition-all"
                style={{
                  backgroundColor: isExpanded ? "var(--v-bg-card)" : "transparent",
                  border: `1px solid ${isExpanded ? "var(--v-border-active)" : "var(--v-border)"}`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--v-accent-muted)" }}>
                  <Icon size={18} style={{ color: "var(--v-accent)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold ${isAdhdMode ? "text-base" : "text-sm"}`} style={{ color: "var(--v-text)" }}>
                    {category.title}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "var(--v-text-dim)" }}>
                    {category.description.slice(0, 60)}...
                  </p>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                  <ChevronRight size={16} style={{ color: "var(--v-text-dim)" }} />
                </motion.div>
              </motion.button>

              {/* Expanded branches */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pt-1 pb-2 flex flex-col gap-1.5">
                      {/* Full description */}
                      <p className="text-[11px] px-3 py-2 leading-relaxed" style={{ color: "var(--v-text-muted)" }}>
                        {category.description}
                      </p>

                      {/* Branches */}
                      {category.branches.map((branch) => (
                        <motion.button
                          key={branch.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onSelectBranch(branch)}
                          className="w-full text-left p-4 rounded-[14px] transition-all"
                          style={{
                            backgroundColor: "var(--v-bg-input)",
                            border: "1px solid var(--v-border)",
                          }}
                        >
                          <p className={`font-bold mb-0.5 ${isAdhdMode ? "text-sm" : "text-xs"}`} style={{ color: "var(--v-text)" }}>
                            {branch.title}
                          </p>
                          <p className="text-[10px] mb-2" style={{ color: "var(--v-accent)" }}>
                            {branch.subtitle}
                          </p>
                          <p className={`leading-relaxed mb-3 ${isAdhdMode ? "text-xs" : "text-[11px]"}`} style={{ color: "var(--v-text-muted)" }}>
                            {branch.description}
                          </p>

                          {/* Example prompts */}
                          <div className="flex flex-col gap-1">
                            {branch.examplePrompts.slice(0, 2).map((prompt, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--v-accent)" }} />
                                <span className="text-[9px] italic truncate" style={{ color: "var(--v-text-dim)" }}>
                                  "{prompt}"
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Shadow + somatic tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {branch.somaticFocus.slice(0, 3).map((zone) => (
                              <span key={zone} className="text-[7px] font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--v-bg-card)", color: "var(--v-text-dim)", border: "1px solid var(--v-border)" }}>
                                {zone}
                              </span>
                            ))}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Simulation shortcut */}
      <button
        onClick={onSimulation}
        className="w-full py-3 rounded-[16px] font-mono text-[10px] tracking-widest uppercase transition-all"
        style={{
          backgroundColor: "var(--v-bg-card)",
          color: "var(--v-text-dim)",
          border: "1px solid var(--v-border)",
        }}
      >
        Переглянути готові ситуації
      </button>

      {/* Method footer */}
      <div className="w-full grid grid-cols-3 gap-2 pt-1">
        {[
          { label: "Юнг", desc: "8 Тіней" },
          { label: "Polyvagal", desc: "3 стани" },
          { label: "Sapolsky", desc: "6 хімій" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5 p-2 rounded-[10px]" style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}>
            <span className="text-[8px] font-mono font-bold uppercase" style={{ color: "var(--v-text-muted)" }}>{item.label}</span>
            <span className="text-[7px]" style={{ color: "var(--v-text-dim)" }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
