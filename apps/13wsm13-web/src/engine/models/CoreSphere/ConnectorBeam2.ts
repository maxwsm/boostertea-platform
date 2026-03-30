// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONNECTOR BEAM 2 (Pack 8 / 11)
// Description: The structural beam linking the DNA Core to the Genesis
// (Vitruvian Creator) module stationed further along the Latitudinal scroll.
// Coordinate Space: Draws line from (0,0,0) -> (LAT 0.20, LON 0.05)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getConnectorBeam2(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pSingularity = sphToCart(0, 0, 0); 
  
  // Genesis / Vitruvian Man location
  const tLat = 0.20;
  const tLon = 0.05; // Slightly offset to the right
  const pTarget = sphToCart(tLat, tLon, 0); 

  // Faint cyan data stream
  lines.push({ p1: pSingularity, p2: pTarget, colorMode: 2, width: 0.8 });

  // Data flow text
  const pMid = sphToCart(tLat/2, tLon/2, 50);
  icons.push({ p: pMid, char: ">> ROOT_NODE_TO_GENESIS", size: 6, type: 'text', meta: { isConnectorText: true } });

  return { lines, icons };
}
