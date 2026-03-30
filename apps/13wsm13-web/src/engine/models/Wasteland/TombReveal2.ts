// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOMB REVEAL 2 (Pack 6 / 11)
// Description: The hidden truth inside Tomb 2 (NFT Rug). 
// Coordinate Space: Exactly matches DeadProjectTomb2
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getTombReveal2(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Coordinates match Tomb 2
  const tLat = baseLat + 0.005;
  const tLon = 0.015; 
  const tElev = elev; 

  const size = 0.002;
  const p1 = sphToCart(tLat - size, tLon, tElev + 15);
  const p2 = sphToCart(tLat + size, tLon, tElev + 15);
  const p3 = sphToCart(tLat, tLon - size, tElev + 15);
  const p4 = sphToCart(tLat, tLon + size, tElev + 15);

  lines.push({ p1, p2, colorMode: 3, width: 2.0 }); 
  lines.push({ p1: p3, p2: p4, colorMode: 3, width: 2.0 });

  icons.push({ 
      p: sphToCart(tLat, tLon, tElev + 25), 
      char: "CAUSE OF DEATH: BAD TOKENOMICS", 
      size: 14, 
      type: 'text',
      meta: { isXRayReveal: true, tombId: 2 } 
  });
  
  icons.push({ 
    p: sphToCart(tLat, tLon, tElev + 20), 
    char: "NO UTILITY. CASCADING SELL PRESSURE.", 
    size: 10, 
    type: 'text',
    meta: { isXRayReveal: true, tombId: 2 } 
  });

  return { lines, icons };
}
