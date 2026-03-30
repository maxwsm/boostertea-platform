// ═══════════════════════════════════════════════════════════════════════
// MODEL: ARCADE PARTICLE VENTS (Pack 5 / 15)
// Description: Ambient fog/particles rising from the floor of the arcade 
// to give it a cyberpunk club atmosphere.
// Coordinate Space: LAT 0.27, Elev 20
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getArcadeParticleVents(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const roomRadius = 0.015; // Kept inside the walls
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
        const a = Math.random() * TAU;
        const r = Math.random() * roomRadius;
        
        const lat = baseLat + Math.cos(a) * r;
        const lon = Math.sin(a) * r;
        
        // Randomly scatter particle elevations from floor to waist-height
        const pElev = elev + 2 + (Math.random() * 40);

        const p = sphToCart(lat, lon, pElev);

        icons.push({ 
            p, 
            char: "~", 
            size: 8 + Math.random() * 6, 
            type: 'rune', 
            meta: { isArcadeFog: true, driftSpeed: 0.002 + Math.random() * 0.002 } 
        });
  }

  return { lines, icons };
}
