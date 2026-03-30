// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONNECTOR BEAM 5 (Pack 8 / 14)
// Description: The playful, glitchy data stream feeding physics updates
// and logic variables to the Game Room Arcade base.
// Coordinate Space: Draws line from (0,0,0) -> (LAT 0.27, LON 0.03)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getConnectorBeam5(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pSingularity = sphToCart(0, 0, 0); 
  
  // Arcade / GameRoom location off-center
  const tLat = 0.27;
  const tLon = 0.03; 
  const pTarget = sphToCart(tLat, tLon, 0);

  // Normal line
  lines.push({ p1: pSingularity, p2: pTarget, colorMode: 2, width: 1.0 });

  // Add random glitch nodes along the beam
  const segments = 5;
  for(let i=1; i<segments; i++){
      const latM = (i/segments)*tLat;
      const lonM = (i/segments)*tLon;
      icons.push({ p: sphToCart(latM, lonM, 20), char: "*", size: 10, type: 'rune', meta: { isGlitchNode: true } });
  }

  const pMid = sphToCart(tLat/2, tLon/2, 40);
  icons.push({ p: pMid, char: ">> ROOT_TO_ARCADE", size: 6, type: 'text' });

  return { lines, icons };
}
