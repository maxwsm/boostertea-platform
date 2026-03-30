// ═══════════════════════════════════════════════════════════════════════
// MODEL: MILESTONE MARKER 2 (Pack 7 / 11)
// Description: The second significant historical marker on the X-Axis.
// Coordinate Space: LAT 0.65, Mid-timeline
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getMilestoneMarker2(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const markLon = -0.015; // Year 5 roughly
  
  const pAxis = sphToCart(baseLat, markLon, elev);
  const pTick = sphToCart(baseLat, markLon, elev - 10);
  lines.push({ p1: pAxis, p2: pTick, colorMode: 1, width: 1.0 });

  icons.push({ 
      p: sphToCart(baseLat, markLon, elev - 15), 
      char: "2018: THE REWRITE", 
      size: 10, 
      type: 'text',
      meta: { isMilestone: true, year: 2018 }
  });

  return { lines, icons };
}
