// ═══════════════════════════════════════════════════════════════════════
// MODEL: LEGO BLOCK - CORE PILLAR (Pack 4 / 8)
// Description: The absolutely massive central foundational pillar of the 
// Citadel. Starts in a chaotic Zero-G state, targets the exact center (0,0).
// Coordinate Space: Chaos starting Elev (300+), Target Elev (0 to 100)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getLegoCorePillar(baseLat: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const width = 0.005;
  const height = 150;

  // TARGET STATE: Perfectly anchored in the center of the Citadel
  const tBaseLat = baseLat;
  const tBaseLon = 0;
  
  const targetBase = sphToCart(tBaseLat, tBaseLon, 0);
  const targetTop = sphToCart(tBaseLat, tBaseLon, height);

  // CHAOS STATE: Floating wildly above the map (e.g., exploded view)
  const chaosLat = tBaseLat + 0.02; // Far North
  const chaosLon = 0.01;            // Top right side
  const chaosElev = 350;            // Extremely high

  const rotOffsetX = -0.01;         // Tilted radically
  const rotOffsetY = -0.005;

  const chaosBase = sphToCart(chaosLat, chaosLon, chaosElev);
  const chaosTop = sphToCart(chaosLat + rotOffsetX, chaosLon + rotOffsetY, chaosElev + height);

  const mass = 15000; // Heaviest object, takes the longest to snap into place

  icons.push({
    p: chaosBase,
    char: "LEGO_CORE",
    size: 0,
    type: 'obj',
    meta: {
      isLegoBlock: true,
      blockType: 'cube_thick',
      mass: mass,
      chaosState: { p1: chaosBase, p2: chaosTop },
      targetState: { p1: targetBase, p2: targetTop },
      currentVelocity: { x: 0, y: 0, z: 0 },
      isSnapped: false
    }
  });

  return { lines, icons };
}
