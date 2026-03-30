// ═══════════════════════════════════════════════════════════════════════
// MODEL: COLOSSEUM ARCHES (Pack 3 / 15)
// Description: Parabolic arches connecting the pillars at various elevations.
// Coordinate Space: LAT 0.20, Elev 40, 80, 120
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getColosseumArches(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pillarCount = 24;
  const elevations = [40, 80, 120];

  elevations.forEach(elev => {
      for (let i = 0; i < pillarCount; i++) {
        const a1 = (i / pillarCount) * TAU;
        const a2 = ((i + 1) / pillarCount) * TAU;
        const r = radius - 0.001;
        
        // Linear connection between pillars
        const p1 = sphToCart(baseLat + Math.cos(a1) * r, Math.sin(a1) * r, elev);
        const p2 = sphToCart(baseLat + Math.cos(a2) * r, Math.sin(a2) * r, elev);
        
        lines.push({ p1, p2, colorMode: 1, width: 1.0 });

        // Parabolic arch generating
        const arcSegments = 8;
        for (let j = 0; j < arcSegments; j++) {
            const t1 = j / arcSegments;
            const t2 = (j + 1) / arcSegments;
            
            // Math for a simple bezier curve between pillars dipping down
            const arcElev1 = elev - (4 * t1 * (1 - t1)) * 10;
            const arcElev2 = elev - (4 * t2 * (1 - t2)) * 10;
            
            const aT1 = a1 + (a2 - a1) * t1;
            const aT2 = a1 + (a2 - a1) * t2;

            const ap1 = sphToCart(baseLat + Math.cos(aT1) * r, Math.sin(aT1) * r, arcElev1);
            const ap2 = sphToCart(baseLat + Math.cos(aT2) * r, Math.sin(aT2) * r, arcElev2);
            
            lines.push({ p1: ap1, p2: ap2, colorMode: 0, width: 0.5 });
        }
      }
  });

  return { lines, icons };
}
