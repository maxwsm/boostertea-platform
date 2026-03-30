// ═══════════════════════════════════════════════════════════════════════
// MODEL 06: NEURAL CITADEL & MACBOOK MATRIX
// Description: The rebuilt ecosystem area. Contains floating MacBooks that 
// always look at the cursor (Mona Lisa tracking) and the Cloth simulation
// parameters for the "Glass Contract".
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

export const CITADEL_LAT = 0.38;
export const CITADEL_RADIUS = 0.025;

export function generateNeuralCitadel(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  // 1. FLOATING MACBOOKS (LookAt Matrix)
  // Instead of static meshes, we place "Icons" that act as pivot points.
  // The actual 3D geometry of the Macbook will be rendered dynamically in MasterCanvas
  // based on these origin points.
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * TAU;
    const r = CITADEL_RADIUS * 1.5;
    const elev = 50 + Math.sin(angle * 3) * 30; // sine wave floating offset

    const originY = CITADEL_LAT + Math.cos(angle) * r;
    const originX = Math.sin(angle) * r;
    
    const p = sphToCart(originY, originX, elev);

    icons.push({ 
      p, 
      char: "MACBOOK_NODE_V2", 
      size: 0, 
      type: 'obj',
      meta: { isMacbook: true, originY, originX, elev } 
    });
  }

  // 2. THE CONTRACT (Cloth Simulation Grid)
  // The contract starts as paper waving in the wind. When signed, it becomes immutable glass.
  // We define a 10x10 grid of points here.
  const GRID_SIZE = 10;
  const CONTRACT_ELEV = 100;
  const sizeX = 0.005;
  const sizeY = 0.005;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const latOffset = (y / GRID_SIZE) * sizeY - (sizeY / 2);
      const lonOffset = (x / GRID_SIZE) * sizeX - (sizeX / 2);
      
      const p = sphToCart(CITADEL_LAT + latOffset, lonOffset, CONTRACT_ELEV);
      
      // We push small particles that represent vertices of the Cloth Mesh.
      icons.push({ 
        p, 
        char: "•", 
        size: 4, 
        type: 'rune',
        meta: { 
          isClothVertex: true, 
          gridX: x, 
          gridY: y, 
          baseLat: CITADEL_LAT + latOffset, 
          baseLon: lonOffset 
        } 
      });
    }
  }

  icons.push({ p: sphToCart(CITADEL_LAT - 0.01, 0, CONTRACT_ELEV + 30), char: "[ THE IMMUTABLE CONTRACT ]", size: 24, type: 'text' });
  icons.push({ p: sphToCart(CITADEL_LAT, 0, CONTRACT_ELEV - 50), char: "SIGNATURE REQUIRED TO MANIFEST GLASS", size: 14, type: 'text' });

  return { lines, icons };
}
