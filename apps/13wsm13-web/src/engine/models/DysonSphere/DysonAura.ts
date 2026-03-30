// ═══════════════════════════════════════════════════════════════════════
// MODEL: DYSON AURA (Pack 3 / 15)
// Description: The massive atmospheric halo surrounding the entire backend 
// sphere. Pulsates slowly giving it an organic, god-like presence.
// Coordinate Space: LAT 0.22, Radius > 0.025
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getDysonAura(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const auraR1 = radius * 1.5;
  const auraR2 = radius * 1.8;
  const segments = 36;

  // Render a massive 2D-plane effect halo (Since it's highly detailed line art)
  for (let i = 0; i < segments; i++) {
      const a = (i / segments) * TAU;
      
      const pInner = sphToCart(baseLat + Math.cos(a) * auraR1, Math.sin(a) * auraR1, elev);
      const pOuter = sphToCart(baseLat + Math.cos(a) * auraR2, Math.sin(a) * auraR2, elev);

      lines.push({ p1: pInner, p2: pOuter, colorMode: 3, width: 0.1 }); // Extremely faint

      // Outer boundary dots
      icons.push({ p: pOuter, char: "-", size: 4, type: 'rune', meta: { rotate: (a * 180) / Math.PI } });
  }

  // Large Branding Background Text
  icons.push({ p: sphToCart(baseLat, 0, elev - 90), char: "BACKEND ML NEURO-SPHERE", size: 30, type: 'text', meta: { isAuraText: true } });

  return { lines, icons };
}
