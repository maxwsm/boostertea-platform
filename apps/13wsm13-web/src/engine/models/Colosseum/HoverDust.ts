// ═══════════════════════════════════════════════════════════════════════
// MODEL: HOVER DUST (Pack 14 / 15)
// Description: Procedurally generates floating ash/code dust particles 
// inside the Colosseum volume to give a dense cinematic feeling of scale.
// Coordinate Space: LAT 0.20, Distributed entirely through the Arena
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getHoverDust(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const particleCount = 200; // High volume
  
  for (let i = 0; i < particleCount; i++) {
      const a = Math.random() * TAU;
      const r = Math.random() * radius; // Inside the ring
      const elev = Math.random() * 150; // Ground to sky
      
      const p = sphToCart(baseLat + Math.cos(a) * r, Math.sin(a) * r, elev);
      
      // Determine what type of dust it is
      const rnd = Math.random();
      let charStr = ".";
      let pSize = 4;
      
      if (rnd > 0.95) {
          charStr = ["0", "1", "x", "/"][Math.floor(Math.random() * 4)];
          pSize = 8;
      }
      
      // We pass orbit speed parameters so they can drift slowly in MasterCanvas
      icons.push({ 
          p, 
          char: charStr, 
          size: pSize, 
          type: 'rune', 
          meta: { 
              isHoverDust: true, 
              driftX: (Math.random() - 0.5) * 0.05, 
              driftY: (Math.random() - 0.5) * 0.05, 
              driftZ: (Math.random() - 0.5) * 0.05 
          } 
      });
  }

  return { lines, icons };
}
