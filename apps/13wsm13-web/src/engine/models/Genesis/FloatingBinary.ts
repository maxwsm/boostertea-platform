// ═══════════════════════════════════════════════════════════════════════
// MODEL: FLOATING BINARY (Pack 2 / 13)
// Description: Streams of "0" and "1" floating in the right quadrant,
// creating a matrix-like localized rain effect.
// Coordinate Space: LAT 0.06, Right Hemisphere Volume
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getFloatingBinary(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const binaryCount = 20;

  for (let i = 0; i < binaryCount; i++) {
      // Confine to the Right Quadrant (+X)
      const angle = Math.random() * Math.PI - Math.PI / 2;
      const rndRadius = Math.random() * radius;
      
      const depth = elev + (Math.random() - 0.5) * 40;

      const p = sphToCart(baseLat + Math.cos(angle) * rndRadius, Math.sin(angle) * rndRadius, depth);
      
      icons.push({ 
          p, 
          // 80% chance of 0 or 1, 20% chance of a bracket
          char: Math.random() > 0.2 ? (Math.random() > 0.5 ? "0" : "1") : (Math.random() > 0.5 ? "{" : "}"), 
          size: 10 + Math.random() * 6, 
          type: 'text',
          meta: { 
              isMatrixRain: true, 
              fallSpeed: 0.1 + Math.random() * 0.2
          }
      });
  }

  return { lines, icons };
}
