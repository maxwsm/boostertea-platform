// ═══════════════════════════════════════════════════════════════════════
// MODEL: ORBIT BAYES (Pack 3 / 6)
// Description: The inner-most orbit path circling the Dyson Sphere.
// Modeled as a faint dashed circle in the 3D plane.
// Coordinate Space: LAT 0.22, Radius + 0.012
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getOrbitBayes(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const orbitRadius = 0.012; 
  const segments = 60;

  // Render a faint dashed orbit line
  for (let i = 0; i < segments; i++) {
      if (i % 2 !== 0) continue; // Dashed

      const a1 = (i / segments) * TAU;
      const a2 = ((i + 1) / segments) * TAU;

      const p1 = sphToCart(baseLat + Math.cos(a1) * orbitRadius, Math.sin(a1) * orbitRadius, elev);
      const p2 = sphToCart(baseLat + Math.cos(a2) * orbitRadius, Math.sin(a2) * orbitRadius, elev);

      lines.push({ p1, p2, colorMode: 0, width: 0.5 }); // Faint background color
  }

  // Add small gravitational nodes locked into the orbit
  icons.push({ p: sphToCart(baseLat, orbitRadius, elev), char: ".", size: 4, type: 'rune' });
  icons.push({ p: sphToCart(baseLat, -orbitRadius, elev), char: ".", size: 4, type: 'rune' });

  return { lines, icons };
}
