// ═══════════════════════════════════════════════════════════════════════
// MODEL: LEGO BLOCK - RIGHT WALL (Pack 4 / 10)
// Description: The massive right shield-wall of the Citadel.
// Coordinate Space: Target (Right of Core), Chaos (Randomized far right sky)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getLegoRightWall(baseLat: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const height = 100;

  // TARGET STATE: Perfectly anchored to the right of the core
  const tBaseLat = baseLat;
  const tBaseLon = 0.01; // Right side
  
  const targetBase = sphToCart(tBaseLat, tBaseLon, 0);
  const targetTop = sphToCart(tBaseLat, tBaseLon, height);

  // CHAOS STATE: Floating far right
  const chaosLat = tBaseLat + 0.005; 
  const chaosLon = 0.03;           
  const chaosElev = 290;            

  const rotOffsetX = 0.01;         
  const rotOffsetY = -0.004;

  const chaosBase = sphToCart(chaosLat, chaosLon, chaosElev);
  const chaosTop = sphToCart(chaosLat + rotOffsetX, chaosLon + rotOffsetY, chaosElev + height);

  const mass = 8000; 

  icons.push({
    p: chaosBase,
    char: "LEGO_WALL_RIGHT",
    size: 0,
    type: 'obj',
    meta: {
      isLegoBlock: true,
      blockType: 'wall_panel',
      mass: mass,
      chaosState: { p1: chaosBase, p2: chaosTop },
      targetState: { p1: targetBase, p2: targetTop },
      currentVelocity: { x: 0, y: 0, z: 0 },
      isSnapped: false
    }
  });

  return { lines, icons };
}
