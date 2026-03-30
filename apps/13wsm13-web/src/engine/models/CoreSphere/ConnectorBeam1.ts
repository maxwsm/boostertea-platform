// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONNECTOR BEAM 1 (Pack 8 / 10)
// Description: The literal "paint-by-numbers" connector line fixing the
// Colosseum Module to the Central Singularity geometry.
// Coordinate Space: Draws line from (0,0,0) -> (LAT 0.15, LON 0)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getConnectorBeam1(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pSingularity = sphToCart(0, 0, 0); // Center Pulse Node
  
  // Colosseum location offset
  const colLat = 0.15;
  const colLon = 0;
  const pTarget = sphToCart(colLat, colLon, 0); // Standard sphere radius roughly

  // Pulsing thick laser
  lines.push({ p1: pSingularity, p2: pTarget, colorMode: 3, width: 1.5 });

  // Data flow text along the beam
  const pMid = sphToCart(colLat/2, colLon/2, 50);
  icons.push({ p: pMid, char: ">> ROOT_NODE_TO_COLOSSEUM", size: 8, type: 'text', meta: { rotate: 25 } });

  return { lines, icons };
}
