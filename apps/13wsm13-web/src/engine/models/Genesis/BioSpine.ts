// ═══════════════════════════════════════════════════════════════════════
// MODEL: BIO SPINE (Pack 2 / 4)
// Description: The left half of the spinal core, modeled as a wavy,
// undulating DNA strand moving along the central axis.
// Coordinate Space: LAT 0.06, Central Y axis
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getBioSpine(baseLat: number, length: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const segments = 40;
  
  for (let i = 0; i < segments; i++) {
    const y1 = -length + (i / segments) * (length * 2);
    const y2 = -length + ((i + 1) / segments) * (length * 2);
    
    // Sine wave offset on the X axis, constrained to left side
    const xOffset1 = -0.0005 + Math.sin(y1 * 800) * 0.0004;
    const xOffset2 = -0.0005 + Math.sin(y2 * 800) * 0.0004;
    
    const p1 = sphToCart(baseLat + y1, xOffset1, elev);
    const p2 = sphToCart(baseLat + y2, xOffset2, elev);

    lines.push({ p1, p2, colorMode: 1, width: 2.0 });

    if (i % 5 === 0) {
        icons.push({ p: p1, char: "•", size: 6, type: 'rune', meta: { isBioCell: true } });
    }
  }

  return { lines, icons };
}
