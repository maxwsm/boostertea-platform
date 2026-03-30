// ═══════════════════════════════════════════════════════════════════════
// MODEL: BLACK SWAN 2 (Pack 7 / 8)
// Description: The second unpredictable event just before the DB collapse.
// Coordinate Space: LAT 0.65, High Elevation 
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getBlackSwan2(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Embedded just before Spike 3
  const bsLon = 0.022;
  const bsElev = elev + 80;
  
  const pCenter = sphToCart(baseLat, bsLon, bsElev);

  const size = 0.001;
  const hSize = 15; // Larger
  
  // This diamond is completely fragmented (only drawing 2 lines of the 4)
  const pTop = sphToCart(baseLat, bsLon, bsElev + hSize);
  const pL = sphToCart(baseLat, bsLon - size, bsElev);
  const pR = sphToCart(baseLat, bsLon + size, bsElev);

  lines.push({ p1: pTop, p2: pL, colorMode: 0, width: 2.0 });
  lines.push({ p1: pTop, p2: pR, colorMode: 0, width: 2.0 });

  // Floating debris from broken diamond
  icons.push({ p: sphToCart(baseLat, bsLon, bsElev - 5), char: "·", size: 6, type: 'rune' });
  icons.push({ p: sphToCart(baseLat, bsLon + 0.001, bsElev - 10), char: "-", size: 6, type: 'rune' });

  icons.push({ p: pCenter, char: "SWAN_NODE", size: 0, type: 'obj', meta: { isBlackSwan: true, swanId: 2, title: 'EDGE INFRASTRUCTURE CHAOS' } });

  return { lines, icons };
}
