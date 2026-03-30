// ═══════════════════════════════════════════════════════════════════════
// MODEL: MILESTONE MARKER 1 (Pack 7 / 10)
// Description: The first significant historical marker on the X-Axis.
// Coordinate Space: LAT 0.65, Near start of timeline
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getMilestoneMarker1(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const markLon = -0.04;
  
  // Vertical tick going downwards from axis
  const pAxis = sphToCart(baseLat, markLon, elev);
  const pTick = sphToCart(baseLat, markLon, elev - 10);
  lines.push({ p1: pAxis, p2: pTick, colorMode: 1, width: 1.0 });

  icons.push({ 
      p: sphToCart(baseLat, markLon, elev - 15), 
      char: "2013: GENESIS", 
      size: 10, 
      type: 'text',
      meta: { isMilestone: true, year: 2013 }
  });

  return { lines, icons };
}
