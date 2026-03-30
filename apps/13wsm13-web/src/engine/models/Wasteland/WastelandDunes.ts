// ═══════════════════════════════════════════════════════════════════════
// MODEL: WASTELAND DUNES (Pack 6 / 1)
// Description: The undulating, barren surface representing the graveyard 
// of 95% of failed Web3/Crypto projects.
// Coordinate Space: LAT 0.50 (Far Back), Lower Elevation (0 to -20)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getWastelandDunes(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const width = 0.08; 
  const depth = 0.05;
  const gridX = 20;
  const gridY = 15;

  // Simple pseudo-random heightmap generation
  const heightMap = Array.from({length: gridX}, () => Array(gridY).fill(0));
  for(let x=0; x<gridX; x++) {
      for(let y=0; y<gridY; y++) {
          // Combination of Sin waves to simulate Perlin Noise dunes
          const val = Math.sin(x * 0.4) * Math.cos(y * 0.5) * 15 + Math.sin(x * 0.8) * 5;
          heightMap[x][y] = val;
      }
  }

  for(let x=0; x<gridX-1; x++) {
      for(let y=0; y<gridY-1; y++) {
          const lat1 = baseLat + (y / gridY) * depth - (depth / 2);
          const lon1 = (x / gridX) * width - (width / 2);
          const z1 = elev + heightMap[x][y];

          const p1 = sphToCart(lat1, lon1, z1);
          
          // Connect right
          const lon2 = ((x+1) / gridX) * width - (width / 2);
          const zRight = elev + heightMap[x+1][y];
          lines.push({ p1, p2: sphToCart(lat1, lon2, zRight), colorMode: 0, width: 0.5 }); // Faint grey

          // Connect down
          const lat2 = baseLat + ((y+1) / gridY) * depth - (depth / 2);
          const zDown = elev + heightMap[x][y+1];
          lines.push({ p1, p2: sphToCart(lat2, lon1, zDown), colorMode: 0, width: 0.5 });
      }
  }

  return { lines, icons };
}
