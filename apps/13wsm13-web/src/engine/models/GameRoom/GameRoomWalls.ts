// ═══════════════════════════════════════════════════════════════════════
// MODEL: GAMEROOM WALLS (Pack 5 / 14)
// Description: Hexagonal fencing enclosing the arcade area, preventing
// the player's view from escaping into the chaotic void too easily.
// Coordinate Space: LAT 0.27, Elev 20
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getGameRoomWalls(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const roomRadius = 0.02;
  const segments = 8; // Octagon
  const wallHeight = 100;

  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        // Base points
        const pB1 = sphToCart(baseLat + Math.cos(a1) * roomRadius, Math.sin(a1) * roomRadius, elev);
        const pB2 = sphToCart(baseLat + Math.cos(a2) * roomRadius, Math.sin(a2) * roomRadius, elev);

        // Top points
        const pT1 = sphToCart(baseLat + Math.cos(a1) * roomRadius, Math.sin(a1) * roomRadius, elev + wallHeight);
        const pT2 = sphToCart(baseLat + Math.cos(a2) * roomRadius, Math.sin(a2) * roomRadius, elev + wallHeight);

        // Vertical pillars
        lines.push({ p1: pB1, p2: pT1, colorMode: 1, width: 2.0 });
        
        // Ceiling ring
        lines.push({ p1: pT1, p2: pT2, colorMode: 1, width: 2.0 });

        // Glass panel cross-bracing (faint X's on the walls)
        lines.push({ p1: pB1, p2: pT2, colorMode: 0, width: 0.3 });
        lines.push({ p1: pB2, p2: pT1, colorMode: 0, width: 0.3 });
        
        // Warning tape / Neon trim along top
        lines.push({ 
            p1: sphToCart(baseLat + Math.cos(a1) * roomRadius, Math.sin(a1) * roomRadius, elev + wallHeight - 10), 
            p2: sphToCart(baseLat + Math.cos(a2) * roomRadius, Math.sin(a2) * roomRadius, elev + wallHeight - 10), 
            colorMode: 3, width: 1.0 
        });
  }

  return { lines, icons };
}
