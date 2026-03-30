// ═══════════════════════════════════════════════════════════════════════
// MODEL: FORMULA TEXT - EINSTEIN (Pack 3 / 12)
// Description: Einstein's Field Equations, animating along Orbit 3.
// Coordinate Space: Dynamic (Starts at LAT 0.22, Radius 0.018, Drastic Tilt)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getFormulaTextEinstein(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const radius = 0.018; 
  const startAngle = Math.PI; // Offset by 180 degrees
  const tiltE = elev + Math.cos(startAngle) * 60; // Matches Orbit 3 math
  
  const p = sphToCart(baseLat + Math.cos(startAngle) * radius, Math.sin(startAngle) * radius, tiltE);

  const txt = "R_uv - 1/2 R g_uv = 8πG/c^4 T_uv";

  icons.push({
    p,
    char: txt,
    size: 16,
    type: 'text',
    meta: { 
        isFormula: true, 
        orbitSpeed: 0.004, 
        angle: startAngle, 
        radius: radius,
        tiltAmplitude: 60,
        tiltPhaseMode: 'cos'
    }
  });

  return { lines, icons };
}
