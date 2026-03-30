// ═══════════════════════════════════════════════════════════════════════
// MODEL: COLOSSEUM PILLARS (Pack 2 / 15)
// Description: Vertical structural columns holding the data rings.
// Coordinate Space: LAT 0.20, Elev 0 to 120
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getColosseumPillars(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pillarCount = 24;
  const maxHeight = 120;

  for (let i = 0; i < pillarCount; i++) {
    const angle = (i / pillarCount) * TAU;
    const r = radius - 0.001; // Slightly inside the foundation

    // Ground connection
    const pBase = sphToCart(baseLat + Math.cos(angle) * r, Math.sin(angle) * r, 0);
    // Highest point
    const pTop = sphToCart(baseLat + Math.cos(angle) * r, Math.sin(angle) * r, maxHeight);
    
    // Thick vertical support using pure wireframe lines
    lines.push({ p1: pBase, p2: pTop, colorMode: 1, width: 1.5 });
    
    // Mid-section structural nodes
    const pMid1 = sphToCart(baseLat + Math.cos(angle) * r, Math.sin(angle) * r, maxHeight * 0.3);
    const pMid2 = sphToCart(baseLat + Math.cos(angle) * r, Math.sin(angle) * r, maxHeight * 0.6);
    
    icons.push({ p: pMid1, char: "—", size: 12, type: 'rune' });
    icons.push({ p: pMid2, char: "—", size: 12, type: 'rune' });
  }

  return { lines, icons };
}
