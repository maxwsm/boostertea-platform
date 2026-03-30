// ═══════════════════════════════════════════════════════════════════════
// MODEL: FORMULA TEXT - BAYES (Pack 3 / 10)
// Description: The actual Bayes Theorem mathematics text, encoded as an 
// interactive object that the MasterCanvas will animate along Orbit 1.
// Coordinate Space: Dynamic (Starts at LAT 0.22, Radius 0.012)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getFormulaTextBayes(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const radius = 0.012; 
  const startAngle = 0; // Starts at 0 degrees
  
  const p = sphToCart(baseLat + Math.cos(startAngle) * radius, Math.sin(startAngle) * radius, elev);

  // The Master string
  const txt = "P(A|B) = [P(B|A) * P(A)] / P(B)";

  icons.push({
    p,
    char: txt,
    size: 14,
    type: 'text',
    meta: { 
        isFormula: true, 
        orbitSpeed: 0.002, 
        angle: startAngle, 
        radius: radius,
        elevOffset: 0 // Flat orbit
    }
  });

  return { lines, icons };
}
