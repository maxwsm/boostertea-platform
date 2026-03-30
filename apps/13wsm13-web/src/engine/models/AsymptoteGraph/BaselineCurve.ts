// ═══════════════════════════════════════════════════════════════════════
// MODEL: BASELINE CURVE (Pack 7 / 3)
// Description: The mathematical exponential curve showing the standard 
// expected growth of the monorepo before hitting the chaos asymptote.
// Coordinate Space: LAT 0.65
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getBaselineCurve(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const startLon = -0.05;
  const endLon = 0.03; // Stops before the extreme right
  const width = endLon - startLon;

  const segments = 40;

  let prevPoint = sphToCart(baseLat, startLon, elev + 2); // Start slightly above Y=0

  for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const currentLon = startLon + t * width;
        
        // Exponential growth e^(t * factor)
        const expHeight = Math.pow(Math.E, t * 4) - 1; 
        
        const currentP = sphToCart(baseLat, currentLon, elev + 2 + expHeight);

        // A smooth, solid line indicating projected growth
        lines.push({ p1: prevPoint, p2: currentP, colorMode: 2, width: 2.0 }); // Clean neon line

        prevPoint = currentP;
  }

  // Label at end of smooth curve
  icons.push({ p: sphToCart(baseLat, endLon + 0.002, prevPoint.z), char: "E[x]", size: 8, type: 'rune' });

  return { lines, icons };
}
