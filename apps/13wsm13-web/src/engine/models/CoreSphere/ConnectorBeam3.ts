// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONNECTOR BEAM 3 (Pack 8 / 12)
// Description: Hardware trace-line connecting the Core to the massive
// Dyson energy sphere. Transfers logical "energy" into the root matrix.
// Coordinate Space: Draws line from (0,0,0) -> (LAT 0.25, LON -0.05)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getConnectorBeam3(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pSingularity = sphToCart(0, 0, 0); 
  
  // Dyson Sphere location offset
  const tLat = 0.25;
  const tLon = -0.05; // Left offset
  const pTarget = sphToCart(tLat, tLon, 0);

  // Thick golden/yellow energy channel (Often colorMode 3 depending on shader rules, we'll assume 3 is active/electric)
  lines.push({ p1: pSingularity, p2: pTarget, colorMode: 3, width: 2.0 });

  const pMid = sphToCart(tLat/2, tLon/2, 100);
  icons.push({ p: pMid, char: "<< DRAINING_DYSON_ENERGY", size: 8, type: 'text', meta: { isPowerLine: true } });

  return { lines, icons };
}
