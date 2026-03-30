// ═══════════════════════════════════════════════════════════════════════
// MODEL: FORMULA TEXT - BIG O (Pack 3 / 13)
// Description: The Architect's philosophy of logarithmic scaling.
// Animating aggressively along the outermost Orbit 4.
// Coordinate Space: Dynamic (Starts at LAT 0.22, Radius 0.022, Flat)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getFormulaTextBigO(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const radius = 0.022; 
  const startAngle = Math.PI * 1.5; // Offset by 270 degrees
  
  const p = sphToCart(baseLat + Math.cos(startAngle) * radius, Math.sin(startAngle) * radius, elev);

  const txt = "O(log n) -> O(1)";

  icons.push({
    p,
    char: txt,
    size: 20,
    type: 'text',
    meta: { 
        isFormula: true, 
        orbitSpeed: -0.005, // Negative = Reverse Orbit Direction
        angle: startAngle, 
        radius: radius,
        tiltAmplitude: 0
    }
  });

  return { lines, icons };
}
