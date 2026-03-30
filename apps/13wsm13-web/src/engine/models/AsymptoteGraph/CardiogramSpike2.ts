// ═══════════════════════════════════════════════════════════════════════
// MODEL: CARDIOGRAM SPIKE 2 (Pack 7 / 5)
// Description: The second violent spike on the timeline representing 
// Out Of Memory (OOM) cascade failures during rapid scaling.
// Coordinate Space: LAT 0.65, Late-timeline
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCardiogramSpike2(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed at roughly 'Year 11'
  const eventLon = 0.015; 
  const baseElev = elev + 45; // Height of exponential curve here

  const pStart = sphToCart(baseLat, eventLon - 0.002, baseElev);
  const pSurge1 = sphToCart(baseLat, eventLon - 0.001, baseElev + 30); // Double spike (flutter)
  const pDrop1 = sphToCart(baseLat, eventLon, baseElev + 10);
  const pSurge2 = sphToCart(baseLat, eventLon + 0.001, baseElev + 80); // Massive surge (OOM crash)
  const pEnd = sphToCart(baseLat, eventLon + 0.003, baseElev + 20);

  // Jagged red/warning cardiogram flutter
  lines.push({ p1: pStart, p2: pSurge1, colorMode: 3, width: 2.0 });
  lines.push({ p1: pSurge1, p2: pDrop1, colorMode: 3, width: 2.0 });
  lines.push({ p1: pDrop1, p2: pSurge2, colorMode: 3, width: 4.0 }); // Fatal crush
  lines.push({ p1: pSurge2, p2: pEnd, colorMode: 3, width: 2.5 });

  icons.push({ p: sphToCart(baseLat, eventLon + 0.001, baseElev + 90), char: "ERR_OOM_CASCADE", size: 10, type: 'text' });

  return { lines, icons };
}
