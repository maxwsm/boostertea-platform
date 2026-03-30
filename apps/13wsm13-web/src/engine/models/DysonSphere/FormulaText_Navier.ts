// ═══════════════════════════════════════════════════════════════════════
// MODEL: FORMULA TEXT - NAVIER-STOKES (Pack 3 / 11)
// Description: The fluid dynamics formula text, animating along Orbit 2.
// Coordinate Space: Dynamic (Starts at LAT 0.22, Radius 0.015, Tilted)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getFormulaTextNavier(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const radius = 0.015; 
  const startAngle = Math.PI / 2; // Offset by 90 degrees
  const tiltE = elev + Math.sin(startAngle) * 30; // Matches Orbit 2 math
  
  const p = sphToCart(baseLat + Math.cos(startAngle) * radius, Math.sin(startAngle) * radius, tiltE);

  const txt = "∂u/∂t + (u·∇)u = -1/ρ ∇p + ν∇²u + f";

  icons.push({
    p,
    char: txt,
    size: 12,
    type: 'text',
    meta: { 
        isFormula: true, 
        orbitSpeed: 0.003, // Slightly faster
        angle: startAngle, 
        radius: radius,
        tiltAmplitude: 30, // Passed to animation engine to match orbit path
        tiltPhaseMode: 'sin'
    }
  });

  return { lines, icons };
}
