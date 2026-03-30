// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - LOVE (Pack 12 / 3)
// Description: Visualizes Oxytocin. Warm, expansive, embracing spherical
// connections representing trust and bonding in the ecosystem.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getNeuroLove(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Slow, comforting breathing logic
  const breath = Math.sin(time) * 0.5 + 0.5; // 0 to 1 smoothly
  
  const rings = 8;
  const segments = 24;

  for (let r = 0; r < rings; r++) {
      const ringRad = 8 + (r * 2) + (breath * 5); // Rings expand gently
      const zHeight = Math.sin((r / rings) * Math.PI) * 15; // Spherical volume

      let pPrev: P3D | null = null;
      let pFirst: P3D | null = null;

      for (let i = 0; i < segments; i++) {
          const a = (i / segments) * TAU + (r * 0.1); // Slight twist
          const pCurr: P3D = { x: Math.cos(a)*ringRad, y: Math.sin(a)*ringRad, z: 20 + zHeight };

          if (pPrev) lines.push({ p1: pPrev, p2: pCurr, colorMode: 1, width: 2.0 });
          else pFirst = pCurr;

          pPrev = pCurr;
      }
      if (pFirst && pPrev) lines.push({ p1: pPrev, p2: pFirst, colorMode: 1, width: 2.0 });

      // Core Trust nodes
      icons.push({ p: { x: 0, y: 0, z: 20 + zHeight }, char: "+", size: 6, type: 'rune', meta: { colorMode: 2 } });
  }

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "NEURO_LOVE", size: 0, type: 'obj', meta: { nlpId: 'love_oxytocin' }});

  return { lines, icons };
}
