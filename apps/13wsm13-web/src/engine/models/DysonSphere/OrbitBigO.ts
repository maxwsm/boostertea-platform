// ═══════════════════════════════════════════════════════════════════════
// MODEL: ORBIT BIG O (Pack 3 / 9)
// Description: The massive outer orbit (O(log n) optimization boundary).
// It acts as the final perimeter for the floating equations.
// Coordinate Space: LAT 0.22, Radius + 0.022, Flat
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getOrbitBigO(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const orbitRadius = 0.022; 
  const segments = 80; // Massive circumference

  for (let i = 0; i < segments; i++) {
      // Solid outer ring (no dashes) but very faint
      const a1 = (i / segments) * TAU;
      const a2 = ((i + 1) / segments) * TAU;

      const p1 = sphToCart(baseLat + Math.cos(a1) * orbitRadius, Math.sin(a1) * orbitRadius, elev);
      const p2 = sphToCart(baseLat + Math.cos(a2) * orbitRadius, Math.sin(a2) * orbitRadius, elev);

      lines.push({ p1, p2, colorMode: 0, width: 0.3 });
  }
  
  // Perimeter markers
  for (let m = 0; m < 4; m++) {
      const angle = (m / 4) * TAU;
      icons.push({ p: sphToCart(baseLat + Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, elev), char: "+", size: 6, type: 'rune' });
  }

  return { lines, icons };
}
