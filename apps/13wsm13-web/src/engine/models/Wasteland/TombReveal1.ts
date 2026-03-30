// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOMB REVEAL 1 (Pack 6 / 10)
// Description: The hidden truth inside Tomb 1 (2017 ICO). 
// This object is visually culled unless the X-Ray scanner overlaps it.
// Coordinate Space: Exactly matches DeadProjectTomb1
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getTombReveal1(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Coordinates match Tomb 1
  const tLat = baseLat - 0.01;
  const tLon = -0.02; 
  const tElev = elev - 5; 

  // Glowing skeletal wireframe (Truth)
  const size = 0.002;
  const p1 = sphToCart(tLat - size, tLon, tElev + 20);
  const p2 = sphToCart(tLat + size, tLon, tElev + 20);
  const p3 = sphToCart(tLat, tLon - size, tElev + 20);
  const p4 = sphToCart(tLat, tLon + size, tElev + 20);

  lines.push({ p1, p2, colorMode: 3, width: 2.0 }); // Scanner color
  lines.push({ p1: p3, p2: p4, colorMode: 3, width: 2.0 });

  // The brutal truth
  icons.push({ 
      p: sphToCart(tLat, tLon, tElev + 30), 
      char: "CAUSE OF DEATH: GREED", 
      size: 14, 
      type: 'text',
      meta: { isXRayReveal: true, tombId: 1 } // Read by the fragment shader or Canvas cull logic
  });
  
  icons.push({ 
    p: sphToCart(tLat, tLon, tElev + 25), 
    char: "LACK OF PRODUCT. 100% SPECULATION.", 
    size: 10, 
    type: 'text',
    meta: { isXRayReveal: true, tombId: 1 } 
  });

  return { lines, icons };
}
