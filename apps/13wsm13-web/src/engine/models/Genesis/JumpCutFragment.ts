// ═══════════════════════════════════════════════════════════════════════
// MODEL: JUMPCUT FRAGMENTS (Pack 2 / 15)
// Description: Pre-rendered geometry shards for the "Shatter Effect".
// When ScrollY changes, these shards fly at the screen causing the 
// Vitruvian Man to literally explode before rebuilding.
// Coordinate Space: LAT 0.06, Hidden inside the body until triggered.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getJumpCutFragment(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const shardCount = 40;

  for (let i = 0; i < shardCount; i++) {
      // Spawn shards closely clustered around the center body mass
      const a = Math.random() * TAU;
      const r = Math.random() * (radius * 0.5);
      
      const sLat = baseLat + Math.cos(a) * r;
      const sLon = Math.sin(a) * r;

      // Make shard a small triangle
      const size = Math.random() * 0.0008;
      const angleRot = Math.random() * TAU;
      
      const p1 = sphToCart(sLat, sLon, elev);
      const p2 = sphToCart(sLat + Math.cos(angleRot)*size, sLon + Math.sin(angleRot)*size, elev);
      const p3 = sphToCart(sLat + Math.cos(angleRot+2.1)*size, sLon + Math.sin(angleRot+2.1)*size, elev);

      // Define velocity vectors pointing Outwards and Towards Camera (-Z visually in MasterCanvas)
      const vX = (Math.random() - 0.5) * 0.2;
      const vY = (Math.random() - 0.5) * 0.2;
      const vElev = 5 + Math.random() * 15; // Shoot towards screen

      // Push as an object meta so the physics engine can update it later
      icons.push({ 
          p: p1, 
          char: "SHARD", 
          size: 0, 
          type: 'obj', 
          meta: { 
              isShatterFragment: true,
              triggered: false,
              geometry: { p1, p2, p3 }, // Passing geometry in meta so MasterCanvas renders it 
              vX, vY, vElev
          } 
      });
  }

  return { lines, icons };
}
