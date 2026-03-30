// ═══════════════════════════════════════════════════════════════════════
// MODEL: GRAPH AXIS X (Pack 7 / 1)
// Description: The primary Timeline axis representing 13 years of the 
// Founder's journey and system evolution.
// Coordinate Space: LAT 0.65 (Deep in the sphere), Elev 0
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getGraphAxisX(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const startLon = -0.05; // Left edge
  const endLon = 0.05;    // Right edge
  
  const pStart = sphToCart(baseLat, startLon, elev);
  const pEnd = sphToCart(baseLat, endLon, elev);

  // Thick base timeline
  lines.push({ p1: pStart, p2: pEnd, colorMode: 1, width: 3.0 });

  // Axis Arrow at the end
  const arrowL = sphToCart(baseLat - 0.001, endLon - 0.002, elev);
  const arrowR = sphToCart(baseLat + 0.001, endLon - 0.002, elev);
  lines.push({ p1: pEnd, p2: arrowL, colorMode: 1, width: 2.0 });
  lines.push({ p1: pEnd, p2: arrowR, colorMode: 1, width: 2.0 });

  icons.push({ p: sphToCart(baseLat + 0.002, endLon + 0.002, elev), char: "T (13 YEARS)", size: 12, type: 'text' });
  icons.push({ p: pStart, char: "T0", size: 8, type: 'text' });

  return { lines, icons };
}
