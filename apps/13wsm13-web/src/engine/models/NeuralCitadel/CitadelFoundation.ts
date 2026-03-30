// ═══════════════════════════════════════════════════════════════════════
// MODEL: CITADEL FOUNDATION (Pack 4 / 1)
// Description: The bedrock for the Neural Nomad Fort. A massive, solid 
// plate hovering above the main Treadmill sphere.
// Coordinate Space: LAT 0.38, Base Elevation (20)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getCitadelFoundation(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const fRadius = 0.03; // Massive plate
  const segments = 12; // Dodecagon / Fortress shape

  // Draw the thick foundation boundary
  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        const p1 = sphToCart(baseLat + Math.cos(a1) * fRadius, Math.sin(a1) * fRadius, elev);
        const p2 = sphToCart(baseLat + Math.cos(a2) * fRadius, Math.sin(a2) * fRadius, elev);
        
        // Thicker plate edges corresponding to solid ground
        lines.push({ p1, p2, colorMode: 1, width: 4.0 });

        // Connect everything to the absolute center of the citadel
        const pCenter = sphToCart(baseLat, 0, elev);
        lines.push({ p1, p2: pCenter, colorMode: 1, width: 0.5 });
  }

  // Energy rings underneath the plate
  for (let i = 0; i < 3; i++) {
        const dropRadius = fRadius - (i * 0.005);
        const dropElev = elev - (i * 10) - 5;
        
        const pA = sphToCart(baseLat + dropRadius, 0, dropElev);
        const pB = sphToCart(baseLat - dropRadius, 0, dropElev);
        lines.push({ p1: pA, p2: pB, colorMode: 3, width: 1.0 }); // Glowing supports
  }

  icons.push({ p: sphToCart(baseLat - fRadius - 0.005, 0, elev), char: "[ FORT GARRISON V2 ]", size: 16, type: 'text' });
  
  return { lines, icons };
}
