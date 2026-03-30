// ═══════════════════════════════════════════════════════════════════════
// MODEL: LEGO BLOCK - DATA NODE (Pack 4 / 12)
// Description: Technical server nodes that slot into the walls.
// Coordinate Space: Target (Front of Left Wall), Chaos (Random)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getLegoDataNode(baseLat: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // TARGET STATE
  const tBaseLat = baseLat - 0.002; // Sticking out the front slightly
  const tBaseLon = -0.008; // On the left wall
  const tElev = 40; 
  
  const targetBase = sphToCart(tBaseLat, tBaseLon, tElev);
  const targetTop = sphToCart(tBaseLat, tBaseLon, tElev + 20);

  // CHAOS STATE: Swirling below
  const chaosLat = tBaseLat - 0.02; 
  const chaosLon = -0.01;           
  const chaosElev = 150;            

  const rotOffsetX = -0.005;         
  const rotOffsetY = -0.005;

  const chaosBase = sphToCart(chaosLat, chaosLon, chaosElev);
  const chaosTop = sphToCart(chaosLat + rotOffsetX, chaosLon + rotOffsetY, chaosElev + 20);

  const mass = 1500; // Very light, snaps quickly

  icons.push({
    p: chaosBase,
    char: "LEGO_DATA_NODE",
    size: 0,
    type: 'obj',
    meta: {
      isLegoBlock: true,
      blockType: 'cube_small',
      mass: mass,
      chaosState: { p1: chaosBase, p2: chaosTop },
      targetState: { p1: targetBase, p2: targetTop },
      currentVelocity: { x: 0, y: 0, z: 0 },
      isSnapped: false
    }
  });

  return { lines, icons };
}
