// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONTRACT CLOTH MESH (Pack 4 / 6)
// Description: The 10x10 vertex grid that simulates a piece of paper waving 
// in the wind. When the user signs it, it undergoes a Glassmorphism transition.
// Coordinate Space: LAT 0.38, Central Elevation (100)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getContractClothMesh(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const GRID_SIZE = 10;
  const sizeLat = 0.008; // Physical size
  const sizeLon = 0.006;

  for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
          const latOffset = (y / GRID_SIZE) * sizeLat - (sizeLat / 2);
          const lonOffset = (x / GRID_SIZE) * sizeLon - (sizeLon / 2);
          
          const p = sphToCart(baseLat + latOffset, lonOffset, elev);
          
          icons.push({ 
              p, 
              // Very small dots making the mesh visible before it shatters
              char: "·", 
              size: 4, 
              type: 'rune',
              meta: { 
                  isClothVertex: true, 
                  gridX: x, 
                  gridY: y, 
                  baseLat: baseLat + latOffset, 
                  baseLon: lonOffset,
                  clothElev: elev 
              } 
          });
          
          // Draw structural lines to form a grid
          if (x < GRID_SIZE - 1) { // Horizontal links
              const pNextX = sphToCart(baseLat + latOffset, ((x + 1)/GRID_SIZE)*sizeLon - (sizeLon/2), elev);
              lines.push({ p1: p, p2: pNextX, colorMode: 0, width: 0.2 });
          }
          if (y < GRID_SIZE - 1) { // Vertical links
              const pNextY = sphToCart(baseLat + ((y + 1)/GRID_SIZE)*sizeLat - (sizeLat/2), lonOffset, elev);
              lines.push({ p1: p, p2: pNextY, colorMode: 0, width: 0.2 });
          }
      }
  }

  return { lines, icons };
}
