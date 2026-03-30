// ═══════════════════════════════════════════════════════════════════════
// MODEL: BRAIN HEMISPHERE CYBER (Pack 2 / 11)
// Description: The cybernetic right hemisphere of the Vitruvian brain.
// Modeled like a rigid Printed Circuit Board (PCB) with right angles.
// Coordinate Space: LAT 0.06 (Head Area), Cyber color
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getBrainHemisphereCyber(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const headLat = baseLat - radius * 0.45; // Top of the spine
  const hRadius = radius * 0.1; // Head radius

  // Central divisor line
  lines.push({ 
      p1: sphToCart(headLat - hRadius, 0, elev), 
      p2: sphToCart(headLat + hRadius * 0.5, 0, elev), 
      colorMode: 2, 
      width: 2.0 
  });

  // PCB routing paths (Right side only)
  const paths = 6;
  for (let i = 0; i < paths; i++) {
      const yStart = headLat - hRadius * 0.8 + (i * hRadius * 0.3);
      const xLen = Math.random() * hRadius * 0.8 + 0.0005;
      
      const pStart = sphToCart(yStart, 0, elev);
      const pMid = sphToCart(yStart, xLen, elev);
      // 90 degree turn down or up
      const yEnd = yStart + (Math.random() > 0.5 ? 1 : -1) * (hRadius * 0.2);
      const pEnd = sphToCart(yEnd, xLen, elev);

      lines.push({ p1: pStart, p2: pMid, colorMode: 2, width: 1.0 });
      lines.push({ p1: pMid, p2: pEnd, colorMode: 2, width: 1.0 });
      
      // Node terminals at the end of traces
      icons.push({ p: pEnd, char: "■", size: 5, type: 'rune', meta: { isPCBTerminal: true } });
  }

  return { lines, icons };
}
