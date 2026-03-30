// ═══════════════════════════════════════════════════════════════════════
// MODEL: CARDIOGRAM SPIKE 1 (Pack 7 / 4)
// Description: A massive, violent heart-monitor style spike representing
// the critical VDS Blackout incident.
// Coordinate Space: LAT 0.65, Mid-timeline
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCardiogramSpike1(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed at roughly 'Year 7'
  const eventLon = -0.01; 
  const baseElev = elev + 20; // Height of curve at this point

  const pStart = sphToCart(baseLat, eventLon - 0.002, baseElev);
  const pDrop = sphToCart(baseLat, eventLon - 0.001, baseElev - 15); // Violent dip
  const pSpike = sphToCart(baseLat, eventLon, baseElev + 60); // Massive surge
  const pRecover = sphToCart(baseLat, eventLon + 0.001, baseElev - 5);
  const pEnd = sphToCart(baseLat, eventLon + 0.002, baseElev + 5);

  // Jagged red/warning cardiogram line
  lines.push({ p1: pStart, p2: pDrop, colorMode: 3, width: 3.0 });
  lines.push({ p1: pDrop, p2: pSpike, colorMode: 3, width: 4.0 }); // The main spike
  lines.push({ p1: pSpike, p2: pRecover, colorMode: 3, width: 3.0 });
  lines.push({ p1: pRecover, p2: pEnd, colorMode: 3, width: 2.0 });

  // Error logging above spike
  icons.push({ p: sphToCart(baseLat, eventLon, baseElev + 70), char: "FATAL: VDS_BLACKOUT", size: 10, type: 'text' });
  icons.push({ p: sphToCart(baseLat, eventLon, baseElev + 65), char: "DATA INTEGRITY LOST", size: 8, type: 'text' });

  return { lines, icons };
}
