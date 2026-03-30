// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOMB REVEAL 3 (Pack 6 / 12)
// Description: The hidden truth inside Tomb 3 (Broken DeFi). 
// Coordinate Space: Exactly matches DeadProjectTomb3
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getTombReveal3(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Coordinates match Tomb 3
  const tLat = baseLat - 0.015;
  const tLon = 0.025; 
  const tElev = elev - 10; 

  const size = 0.002;
  const p1 = sphToCart(tLat - size, tLon, tElev + 15);
  const p2 = sphToCart(tLat + size, tLon, tElev + 15);
  const p3 = sphToCart(tLat, tLon - size, tElev + 15);
  const p4 = sphToCart(tLat, tLon + size, tElev + 15);

  lines.push({ p1, p2, colorMode: 3, width: 2.0 }); 
  lines.push({ p1: p3, p2: p4, colorMode: 3, width: 2.0 });

  icons.push({ 
      p: sphToCart(tLat, tLon, tElev + 25), 
      char: "CAUSE OF DEATH: LOGIC EXPLOIT", 
      size: 14, 
      type: 'text',
      meta: { isXRayReveal: true, tombId: 3 } 
  });
  
  icons.push({ 
    p: sphToCart(tLat, tLon, tElev + 20), 
    char: "REENTRANCY ATTACK ON LINE 64.", 
    size: 10, 
    type: 'text',
    meta: { isXRayReveal: true, tombId: 3 } 
  });

  return { lines, icons };
}
