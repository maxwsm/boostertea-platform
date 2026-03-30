// ═══════════════════════════════════════════════════════════════════════
// MODEL: GRAPH AXIS Y (Pack 7 / 2)
// Description: The vertical axis representing System Complexity and 
// Founder Stress levels (approaching infinity).
// Coordinate Space: LAT 0.65, Left Edge (Lon -0.05)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getGraphAxisY(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const startLon = -0.05; // Left edge
  
  const pBottom = sphToCart(baseLat, startLon, elev);
  const pTop = sphToCart(baseLat, startLon, elev + 150); // Very high

  // Thick vertical axis
  lines.push({ p1: pBottom, p2: pTop, colorMode: 1, width: 3.0 });

  // Axis Arrow at the top
  const arrowL = sphToCart(baseLat - 0.001, startLon, elev + 145);
  const arrowR = sphToCart(baseLat + 0.001, startLon, elev + 145);
  lines.push({ p1: pTop, p2: arrowL, colorMode: 1, width: 2.0 });
  lines.push({ p1: pTop, p2: arrowR, colorMode: 1, width: 2.0 });

  icons.push({ p: sphToCart(baseLat - 0.005, startLon, elev + 155), char: "COMPLEXITY", size: 12, type: 'text' });

  // Measurement ticks going up
  for(let i=1; i<=10; i++) {
        const tickZ = elev + (i * 15);
        const pT1 = sphToCart(baseLat, startLon, tickZ);
        const pT2 = sphToCart(baseLat, startLon + 0.001, tickZ);
        lines.push({ p1: pT1, p2: pT2, colorMode: 1, width: 1.0 });
  }

  return { lines, icons };
}
