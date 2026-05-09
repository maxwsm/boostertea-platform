"use client";

/**
 * SHADOW ICONS — Professional SVG icon system
 * Replaces childish emoji with geometric glyphs
 * Each icon encodes the psychological essence of its archetype
 */

import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (props: IconProps) => ({
  width: props.size || 24,
  height: props.size || 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

/** Ескапіст — Розірване коло (розрив зв'язку з реальністю) */
export function IconEscapist(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <path d="M 5 19 A 9 9 0 1 1 19 19" />
      <path d="M 5 19 L 8 16" />
      <path d="M 19 19 L 16 16" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" opacity={0.4} />
    </svg>
  );
}

/** Перфекціоніст — Сітка з точкою в центрі (тотальний контроль) */
export function IconPerfectionist(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity={0.6} />
    </svg>
  );
}

/** Жертва — Коло, що стискається (безсилість, колапс) */
export function IconVictim(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="9" strokeDasharray="3 3" opacity={0.3} />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 2" opacity={0.5} />
      <circle cx="12" cy="12" r="3" opacity={0.8} />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/** Агресор — Стріла вгору з тріщинами (сила без контролю) */
export function IconAggressor(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <path d="M12 3 L12 21" strokeWidth={2} />
      <path d="M7 8 L12 3 L17 8" strokeWidth={2} />
      <path d="M8 14 L5 17" opacity={0.5} />
      <path d="M16 14 L19 17" opacity={0.5} />
      <path d="M10 11 L7 13" opacity={0.3} />
      <path d="M14 11 L17 13" opacity={0.3} />
    </svg>
  );
}

/** Самозванець — Маска з тріщиною (фальшива оболонка) */
export function IconImpostor(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <path d="M4 10 C4 6 8 3 12 3 C16 3 20 6 20 10 L20 13 C20 14 19 15 18 15 L6 15 C5 15 4 14 4 13 Z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" opacity={0.5} />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" opacity={0.5} />
      <path d="M12 3 L11 10 L13 15" strokeDasharray="2 1" opacity={0.6} />
      <path d="M8 18 Q12 21 16 18" opacity={0.4} />
    </svg>
  );
}

/** Рятувальник — Щит з тріщиною (перенапруга від захисту) */
export function IconRescuer(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <path d="M12 3 L20 7 L20 13 C20 17 16 20 12 22 C8 20 4 17 4 13 L4 7 Z" />
      <path d="M12 8 L12 16" strokeDasharray="2 2" opacity={0.5} />
      <path d="M9 11 L15 13" strokeDasharray="2 2" opacity={0.3} />
    </svg>
  );
}

/** Маніпулятор — Павутина з вузлами (тіньова влада) */
export function IconManipulator(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity={0.6} />
      <circle cx="5" cy="5" r="1.5" fill="currentColor" opacity={0.3} />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" opacity={0.3} />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" opacity={0.3} />
      <circle cx="19" cy="19" r="1.5" fill="currentColor" opacity={0.3} />
      <line x1="12" y1="12" x2="5" y2="5" opacity={0.4} />
      <line x1="12" y1="12" x2="19" y2="5" opacity={0.4} />
      <line x1="12" y1="12" x2="5" y2="19" opacity={0.4} />
      <line x1="12" y1="12" x2="19" y2="19" opacity={0.4} />
      <line x1="5" y1="5" x2="19" y2="5" opacity={0.15} />
      <line x1="19" y1="5" x2="19" y2="19" opacity={0.15} />
      <line x1="19" y1="19" x2="5" y2="19" opacity={0.15} />
      <line x1="5" y1="19" x2="5" y2="5" opacity={0.15} />
    </svg>
  );
}

/** Спостерігач — Розфокусоване око (дисоціація) */
export function IconDissociator(props: IconProps) {
  const p = defaults(props);
  return (
    <svg {...p}>
      <path d="M2 12 C2 12 6 5 12 5 C18 5 22 12 22 12 C22 12 18 19 12 19 C6 19 2 12 2 12 Z" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity={0.3} />
      <line x1="8" y1="8" x2="16" y2="16" opacity={0.2} strokeWidth={3} />
    </svg>
  );
}

// ─── ICON REGISTRY ─────────────────────────
export const SHADOW_ICON_MAP: Record<string, React.FC<IconProps>> = {
  escapist: IconEscapist,
  perfectionist: IconPerfectionist,
  victim: IconVictim,
  aggressor: IconAggressor,
  impostor: IconImpostor,
  rescuer: IconRescuer,
  manipulator: IconManipulator,
  dissociator: IconDissociator,
};

/** Get shadow icon component by ID */
export function ShadowIcon({ shadowId, ...props }: IconProps & { shadowId: string }) {
  const Icon = SHADOW_ICON_MAP[shadowId];
  if (!Icon) return null;
  return <Icon {...props} />;
}

// ─── ACCENT COLOR PER SHADOW ─────────────────────────
export const SHADOW_ACCENT_COLORS: Record<string, string> = {
  escapist: "text-amber",
  perfectionist: "text-red-400",
  victim: "text-slate-400",
  aggressor: "text-red-500",
  impostor: "text-purple-400",
  rescuer: "text-ocean",
  manipulator: "text-amber/80",
  dissociator: "text-slate-500",
};

export const SHADOW_BG_COLORS: Record<string, string> = {
  escapist: "bg-amber/10 border-amber/20",
  perfectionist: "bg-red-400/10 border-red-400/20",
  victim: "bg-slate-400/10 border-slate-400/20",
  aggressor: "bg-red-500/10 border-red-500/20",
  impostor: "bg-purple-400/10 border-purple-400/20",
  rescuer: "bg-ocean/10 border-ocean/20",
  manipulator: "bg-amber/5 border-amber/15",
  dissociator: "bg-slate-500/10 border-slate-500/20",
};
