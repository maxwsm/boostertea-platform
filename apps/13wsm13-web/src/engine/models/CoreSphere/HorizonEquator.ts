// ═══════════════════════════════════════════════════════════════════════
// MODEL: HORIZON EQUATOR (Pack 8 / 1)
// Description: The primary massive orbital ring of the Core Treadmill.
// Defines the exact center latitude of the scrolling universe.
// Coordinate Space: LAT 0 (Equator), Radius 15000 (Massive)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getHorizonEquator(radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const segments = 120; // High resolution curve

  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        // Equator is exactly at Latitude 0
        const p1 = sphToCart(0, a1, 0); 
        const p2 = sphToCart(0, a2, 0);
        
        // Massive glowing horizon
        lines.push({ p1, p2, colorMode: 1, width: 4.0 });

        // Add coordinate markers to the horizon
        if (i % 10 === 0) {
            icons.push({ p: p1, char: "SEC_" + i, size: 10, type: 'text' });
            // Draw small downward ticks
            const pTick = sphToCart(0.005, a1, -20);
            lines.push({ p1, p2: pTick, colorMode: 1, width: 1.0 });
        }
  }

  // Master Anchor point defining the whole treadmill rotation state
  icons.push({ 
      p: sphToCart(0, 0, 0), 
      char: "TREADMILL_CORE_ANCHOR", 
      size: 0, 
      type: 'obj', 
      meta: { isMasterTreadmill: true } 
  });

  return { lines, icons };
}
