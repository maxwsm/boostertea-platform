// ═══════════════════════════════════════════════════════════════════════
// MODEL: CARDIOGRAM SPIKE 3 (Pack 7 / 6)
// Description: The final massive spike right before the Asymptote.
// Represents the monolithic DB crash before migrating to Edge/NeonDB.
// Coordinate Space: LAT 0.65, Very late timeline
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCardiogramSpike3(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed right before the limit
  const eventLon = 0.025; 
  const baseElev = elev + 100; // Curve is very high now

  const pStart = sphToCart(baseLat, eventLon - 0.001, baseElev);
  const pDrop = sphToCart(baseLat, eventLon, baseElev - 80); // Massive drop to near 0
  const pSpike = sphToCart(baseLat, eventLon + 0.001, baseElev + 150); // Immediate surge off-charts
  const pEnd = sphToCart(baseLat, eventLon + 0.002, baseElev + 120);

  // Red/warning cardiogram
  lines.push({ p1: pStart, p2: pDrop, colorMode: 3, width: 3.0 });
  lines.push({ p1: pDrop, p2: pSpike, colorMode: 3, width: 5.0 }); // Core break
  lines.push({ p1: pSpike, p2: pEnd, colorMode: 3, width: 2.0 });

  icons.push({ p: sphToCart(baseLat, eventLon, baseElev - 90), char: "[ CONNECTION REFUSED: POSTGRES ]", size: 10, type: 'text' });

  return { lines, icons };
}
