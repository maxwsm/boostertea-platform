// ═══════════════════════════════════════════════════════════════════════
// MODEL: AMBIGRAM CORE VORTEX (Pack 9 / 1)
// Description: The central orchestrator that spawns the 13 WSM 13 Ambigram.
// It reserves the spatial bounding box where the 131,313 dots will exist
// and dictates the physical coordinates of the 'Order' state.
// Coordinate Space: LAT 0.10 (Between Colosseum and Genesis)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getAmbigramCoreVortex(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed in a very visible sky-zone
  const aLat = baseLat + 0.10;
  const aLon = 0;
  const aElev = elev + 300; // Floating majestically

  const pCenter = sphToCart(aLat, aLon, aElev);

  // Instead of pushing 131,313 PIcons here, we push one massive orchestrator Object.
  // The Canvas renderer must understand this specific meta tag to draw the buffer geometry!
  icons.push({ 
      p: pCenter, 
      char: "AMBIGRAM_SEED_131313", 
      size: 0, 
      type: 'obj', 
      meta: { 
          isAmbigramMatrix: true, 
          dotCount: 131313,
          radiusX: 0.1, // Massive width across the sky
          radiusY: 0.05,
          state: 'ORDER' // Default state until user interacts
      } 
  });

  // Invisible bounding wireframe used for debug/development positioning
  const s = 0.02;
  const pTL = sphToCart(aLat - s, aLon - s*4, aElev + 100);
  const pTR = sphToCart(aLat - s, aLon + s*4, aElev + 100);
  const pBL = sphToCart(aLat + s, aLon - s*4, aElev - 100);
  const pBR = sphToCart(aLat + s, aLon + s*4, aElev - 100);

  lines.push({ p1: pTL, p2: pTR, colorMode: 0, width: 0.2 });
  lines.push({ p1: pTR, p2: pBR, colorMode: 0, width: 0.2 });
  lines.push({ p1: pBR, p2: pBL, colorMode: 0, width: 0.2 });
  lines.push({ p1: pBL, p2: pTL, colorMode: 0, width: 0.2 });

  return { lines, icons };
}
