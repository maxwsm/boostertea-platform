// ═══════════════════════════════════════════════════════════════════════
// MODEL: MILESTONE MARKER 3 (Pack 7 / 12)
// Description: The final destination point on the graph before the 
// Asymptote Wall. Represents the current 13-year culmination.
// Coordinate Space: LAT 0.65, Late-timeline
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getMilestoneMarker3(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const markLon = 0.035; // Nearing the Asymptote limit
  
  const pAxis = sphToCart(baseLat, markLon, elev);
  const pTick = sphToCart(baseLat, markLon, elev - 10);
  lines.push({ p1: pAxis, p2: pTick, colorMode: 1, width: 2.0 });

  icons.push({ 
      p: sphToCart(baseLat, markLon, elev - 15), 
      char: "2026: THE OMNIVERSE", 
      size: 12, 
      type: 'text',
      meta: { isMilestone: true, year: 2026 }
  });

  return { lines, icons };
}
