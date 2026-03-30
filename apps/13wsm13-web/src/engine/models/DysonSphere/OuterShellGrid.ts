// ═══════════════════════════════════════════════════════════════════════
// MODEL: OUTER SHELL GRID (Pack 3 / 3)
// Description: The massive outer cage of the Dyson Sphere.
// It breathes (pulsates in radius) over time. Uses thicker geometry.
// Coordinate Space: LAT 0.22, High Elevation (400)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getOuterShellGrid(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const lats = 16;
  const lons = 32;

  // Render a massive bounding sphere outline
  for (let i = 0; i < lats; i++) {
    const latA1 = (i / lats) * Math.PI;
    const latA2 = ((i + 1) / lats) * Math.PI;

    for (let j = 0; j < lons; j++) {
      const lonA1 = (j / lons) * TAU;
      const lonA2 = ((j + 1) / lons) * TAU;

      const p1 = sphToCart(baseLat + Math.cos(latA1) * radius, Math.sin(latA1) * Math.sin(lonA1) * radius, elev + Math.sin(latA1) * Math.cos(lonA1) * 200);
      const p2 = sphToCart(baseLat + Math.cos(latA1) * radius, Math.sin(latA1) * Math.sin(lonA2) * radius, elev + Math.sin(latA1) * Math.cos(lonA2) * 200);
      
      // Thicker lines for the outer cage
      lines.push({ p1, p2, colorMode: 2, width: 1.5 }); // Cyber coloring (usually bright blue/green)
      
      if (i < lats - 1) {
        const p3 = sphToCart(baseLat + Math.cos(latA2) * radius, Math.sin(latA2) * Math.sin(lonA1) * radius, elev + Math.sin(latA2) * Math.cos(lonA1) * 200);
        lines.push({ p1, p2: p3, colorMode: 2, width: 1.5 });
      }

      // Intersection joints
      if (Math.random() > 0.8) {
          icons.push({ p: p1, char: "x", size: 6, type: 'rune', meta: { isCageJoint: true } });
      }
    }
  }

  return { lines, icons };
}
