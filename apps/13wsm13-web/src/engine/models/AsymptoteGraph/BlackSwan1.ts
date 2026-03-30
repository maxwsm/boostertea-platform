// ═══════════════════════════════════════════════════════════════════════
// MODEL: BLACK SWAN 1 (Pack 7 / 7)
// Description: An unpredictable, highly chaotic node/event triggering 
// the first massive exponential jump. Represented as a shattered diamond.
// Coordinate Space: LAT 0.65, Embedded in the timeline curve
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getBlackSwan1(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Embedded just before Spike 1
  const bsLon = -0.012;
  const bsElev = elev + 10;
  
  const pCenter = sphToCart(baseLat, bsLon, bsElev);

  // Shattered Diamond logic
  const size = 0.001;
  const hSize = 10;
  
  const pTop = sphToCart(baseLat, bsLon, bsElev + hSize);
  const pBot = sphToCart(baseLat, bsLon, bsElev - hSize);
  const pL = sphToCart(baseLat, bsLon - size, bsElev);
  const pR = sphToCart(baseLat + 0.001, bsLon + size, bsElev + 2); // Slightly broken off

  lines.push({ p1: pTop, p2: pL, colorMode: 0, width: 1.5 });
  lines.push({ p1: pTop, p2: pR, colorMode: 0, width: 1.0 }); // Broken edge
  lines.push({ p1: pL, p2: pBot, colorMode: 0, width: 1.5 });
  lines.push({ p1: pBot, p2: pR, colorMode: 0, width: 0.5 }); // Broken edge

  // The Swan Meta triggers a tooltip or chaotic UI effect on hover
  icons.push({ p: pCenter, char: "SWAN_NODE", size: 0, type: 'obj', meta: { isBlackSwan: true, swanId: 1, title: 'UNPREDICTABLE SCALE' } });

  return { lines, icons };
}
