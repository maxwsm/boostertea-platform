// ═══════════════════════════════════════════════════════════════════════
// MODEL: LEGO BLOCK - ROOF ARCH (Pack 4 / 11)
// Description: The bridging roof array of the Citadel.
// Coordinate Space: Target (Top of the Core), Chaos (Randomized far sky)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getLegoRoofArch(baseLat: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const width = 0.02; // Very wide bridge

  // TARGET STATE: Perfectly anchored on top of the walls
  const tBaseLat = baseLat + 0.005; // Slightly deeper
  const tBaseLon = 0; // Centered
  const tElev = 100; // Sits on top of the 100-height walls
  
  const targetBase = sphToCart(tBaseLat, -width/2, tElev);
  const targetTop = sphToCart(tBaseLat, width/2, tElev);

  // CHAOS STATE: Floating high up
  const chaosLat = tBaseLat + 0.03; 
  const chaosLon = 0;           
  const chaosElev = 450;            

  const rotOffsetX = 0.02;         
  const rotOffsetY = -0.01;

  const chaosBase = sphToCart(chaosLat, chaosLon - width/2, chaosElev);
  const chaosTop = sphToCart(chaosLat + rotOffsetX, chaosLon + width/2 + rotOffsetY, chaosElev);

  const mass = 4000; // Lighter than walls so it flies in faster

  icons.push({
    p: chaosBase,
    char: "LEGO_ROOF_ARCH",
    size: 0,
    type: 'obj',
    meta: {
      isLegoBlock: true,
      blockType: 'roof_arch',
      mass: mass,
      chaosState: { p1: chaosBase, p2: chaosTop },
      targetState: { p1: targetBase, p2: targetTop },
      currentVelocity: { x: 0, y: 0, z: 0 },
      isSnapped: false
    }
  });

  return { lines, icons };
}
