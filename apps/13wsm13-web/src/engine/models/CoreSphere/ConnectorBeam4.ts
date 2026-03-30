// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONNECTOR BEAM 4 (Pack 8 / 13)
// Description: Secure encrypted pipeline connecting the DNA core to the 
// Syndicate's reconstructed Neural Citadel.
// Coordinate Space: Draws line from (0,0,0) -> (LAT 0.38, LON 0)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getConnectorBeam4(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pSingularity = sphToCart(0, 0, 0); 
  
  // Neural Citadel location 
  const tLat = 0.38;
  const tLon = 0; 
  const pTarget = sphToCart(tLat, tLon, 0);

  // Very structured, dashed encryption tunnel (Rendered as multiple parallel lines)
  lines.push({ p1: pSingularity, p2: pTarget, colorMode: 1, width: 3.0 });
  
  // Side guard rails for the tunnel
  lines.push({ p1: sphToCart(0, -0.001, 0), p2: sphToCart(tLat, tLon-0.005, 0), colorMode: 1, width: 0.5 });
  lines.push({ p1: sphToCart(0, 0.001, 0), p2: sphToCart(tLat, tLon+0.005, 0), colorMode: 1, width: 0.5 });

  const pMid = sphToCart(tLat/2, tLon/2, 30);
  icons.push({ p: pMid, char: ">> SECURE_CITADEL_UPLINK", size: 6, type: 'text' });

  return { lines, icons };
}
