// ═══════════════════════════════════════════════════════════════════════
// MODEL: LEGO BLOCK - LEFT WALL (Pack 4 / 9)
// Description: The massive left shield-wall of the Citadel.
// Coordinate Space: Target (Left of Core), Chaos (Randomized far left sky)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getLegoLeftWall(baseLat: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const height = 100;

  // TARGET STATE: Perfectly anchored to the left of the core
  const tBaseLat = baseLat;
  const tBaseLon = -0.01; // Left side
  
  const targetBase = sphToCart(tBaseLat, tBaseLon, 0);
  const targetTop = sphToCart(tBaseLat, tBaseLon, height);

  // CHAOS STATE: Floating far left
  const chaosLat = tBaseLat - 0.01; 
  const chaosLon = -0.03;           
  const chaosElev = 280;            

  const rotOffsetX = 0.005;         
  const rotOffsetY = 0.008;

  const chaosBase = sphToCart(chaosLat, chaosLon, chaosElev);
  const chaosTop = sphToCart(chaosLat + rotOffsetX, chaosLon + rotOffsetY, chaosElev + height);

  const mass = 8000; 

  icons.push({
    p: chaosBase,
    char: "LEGO_WALL_LEFT",
    size: 0,
    type: 'obj',
    meta: {
      isLegoBlock: true,
      blockType: 'wall_panel', // Tells MasterCanvas to render it wide and flat
      mass: mass,
      chaosState: { p1: chaosBase, p2: chaosTop },
      targetState: { p1: targetBase, p2: targetTop },
      currentVelocity: { x: 0, y: 0, z: 0 },
      isSnapped: false
    }
  });

  return { lines, icons };
}
