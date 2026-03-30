// ═══════════════════════════════════════════════════════════════════════
// MODEL: ORBIT NAVIER-STOKES (Pack 3 / 7)
// Description: The 2nd orbit path circling the Dyson Sphere.
// Features a different dash pattern and slight Z-axis tilt.
// Coordinate Space: LAT 0.22, Radius + 0.015, Tilted Elevation
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getOrbitNavierStokes(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const orbitRadius = 0.015; 
  const segments = 40;

  for (let i = 0; i < segments; i++) {
      // Different dash pattern (3 drawn, 1 skipped)
      if (i % 4 === 0) continue; 

      const a1 = (i / segments) * TAU;
      const a2 = ((i + 1) / segments) * TAU;

      // Add a slight sine wave to Elevation to simulate an angled orbital plane
      const tiltE1 = elev + Math.sin(a1) * 30;
      const tiltE2 = elev + Math.sin(a2) * 30;

      const p1 = sphToCart(baseLat + Math.cos(a1) * orbitRadius, Math.sin(a1) * orbitRadius, tiltE1);
      const p2 = sphToCart(baseLat + Math.cos(a2) * orbitRadius, Math.sin(a2) * orbitRadius, tiltE2);

      lines.push({ p1, p2, colorMode: 0, width: 0.5 });
  }

  return { lines, icons };
}
