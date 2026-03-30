// ═══════════════════════════════════════════════════════════════════════
// MODEL: ORBIT EINSTEIN (Pack 3 / 8)
// Description: The 3rd orbit path circling the Dyson Sphere.
// Severely tilted orbital plane to mimic atomic structure.
// Coordinate Space: LAT 0.22, Radius + 0.018, Drastic Tilt
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getOrbitEinstein(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const orbitRadius = 0.018; 
  const segments = 50;

  for (let i = 0; i < segments; i++) {
      if (i % 3 === 0) continue; // Long dashes

      // Offset the phase by 90 degrees (Math.PI/2) for a cross-orbit visually
      const a1 = (i / segments) * TAU;
      const a2 = ((i + 1) / segments) * TAU;

      const tiltE1 = elev + Math.cos(a1) * 60; // Using cosine for perpendicular tilt
      const tiltE2 = elev + Math.cos(a2) * 60;

      const p1 = sphToCart(baseLat + Math.cos(a1) * orbitRadius, Math.sin(a1) * orbitRadius, tiltE1);
      const p2 = sphToCart(baseLat + Math.cos(a2) * orbitRadius, Math.sin(a2) * orbitRadius, tiltE2);

      lines.push({ p1, p2, colorMode: 0, width: 0.5 });
  }

  return { lines, icons };
}
