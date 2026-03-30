// ═══════════════════════════════════════════════════════════════════════
// MODEL: NODE PUZZLE - TARGET 1 (Pack 5 / 3)
// Description: The first target port (BoosterTea Ecosystem API) waiting 
// for exactly 1 active cable connection from the Master Router.
// Coordinate Space: LAT 0.27 (Mid-Left), Elev 40
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getNodePuzzleTarget1(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const nodeLat = baseLat + 0.015;
  const nodeLon = -0.025; // Closer to edge
  const blockElev = elev + 10;

  // Render Port geometry (Diamond slot)
  const size = 0.0015;
  const pT = sphToCart(nodeLat, nodeLon - size, blockElev);
  const pR = sphToCart(nodeLat + size, nodeLon, blockElev);
  const pB = sphToCart(nodeLat, nodeLon + size, blockElev);
  const pL = sphToCart(nodeLat - size, nodeLon, blockElev);

  lines.push({ p1: pT, p2: pR, colorMode: 1, width: 1.5 }); // Starts white/offline
  lines.push({ p1: pR, p2: pB, colorMode: 1, width: 1.5 });
  lines.push({ p1: pB, p2: pL, colorMode: 1, width: 1.5 });
  lines.push({ p1: pL, p2: pT, colorMode: 1, width: 1.5 });

  icons.push({ 
      p: sphToCart(nodeLat, nodeLon, blockElev + 15), 
      char: "[ BOOSTER_TEA API ]", 
      size: 12, 
      type: 'text', 
      meta: { isNodeTarget: true, connected: false, requiredVoltage: 5 } 
  });

  return { lines, icons };
}
