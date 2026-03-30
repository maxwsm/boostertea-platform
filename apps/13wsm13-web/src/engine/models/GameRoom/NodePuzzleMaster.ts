// ═══════════════════════════════════════════════════════════════════════
// MODEL: NODE PUZZLE - MASTER (Pack 5 / 2)
// Description: The central power source/router for the Node Drag-and-Drop 
// minigame. Cables originate from this node.
// Coordinate Space: LAT 0.27 (Left side), Elev 60
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getNodePuzzleMaster(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed on the left side of the arcade platform
  const nodeLat = baseLat + 0.005;
  const nodeLon = -0.015;

  // Master Node Box
  const size = 0.002;
  const blockElev = elev + 20;

  const pF1 = sphToCart(nodeLat - size, nodeLon - size, blockElev - 10);
  const pF2 = sphToCart(nodeLat + size, nodeLon - size, blockElev - 10);
  const pF3 = sphToCart(nodeLat + size, nodeLon + size, blockElev + 10);
  const pF4 = sphToCart(nodeLat - size, nodeLon + size, blockElev + 10);

  lines.push({ p1: pF1, p2: pF2, colorMode: 3, width: 2.0 }); // Glowing green source
  lines.push({ p1: pF2, p2: pF3, colorMode: 3, width: 2.0 });
  lines.push({ p1: pF3, p2: pF4, colorMode: 3, width: 2.0 });
  lines.push({ p1: pF4, p2: pF1, colorMode: 3, width: 2.0 });

  icons.push({ 
      p: sphToCart(nodeLat, nodeLon, blockElev), 
      char: "MASTER_MATRIX", 
      size: 16, 
      type: 'text', 
      meta: { isNodeSource: true, cablesActive: 0 } 
  });

  return { lines, icons };
}
