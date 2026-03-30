// ═══════════════════════════════════════════════════════════════════════
// MODEL: NODE PUZZLE - TARGET 2 (Pack 5 / 4)
// Description: The second target port (FunnyDrops Architecture) waiting 
// for the second cable connection.
// Coordinate Space: LAT 0.27 (Center-Left), Elev 30
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getNodePuzzleTarget2(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const nodeLat = baseLat + 0.02;
  const nodeLon = -0.01; 
  const blockElev = elev + 5;

  // Render Port geometry (Diamond slot)
  const size = 0.0015;
  const pT = sphToCart(nodeLat, nodeLon - size, blockElev);
  const pR = sphToCart(nodeLat + size, nodeLon, blockElev);
  const pB = sphToCart(nodeLat, nodeLon + size, blockElev);
  const pL = sphToCart(nodeLat - size, nodeLon, blockElev);

  lines.push({ p1: pT, p2: pR, colorMode: 1, width: 1.5 }); 
  lines.push({ p1: pR, p2: pB, colorMode: 1, width: 1.5 });
  lines.push({ p1: pB, p2: pL, colorMode: 1, width: 1.5 });
  lines.push({ p1: pL, p2: pT, colorMode: 1, width: 1.5 });

  icons.push({ 
      p: sphToCart(nodeLat, nodeLon, blockElev + 15), 
      char: "[ FUNNY_DROPS API ]", 
      size: 12, 
      type: 'text', 
      meta: { isNodeTarget: true, connected: false, requiredVoltage: 5 } 
  });

  return { lines, icons };
}
