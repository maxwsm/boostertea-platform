// ═══════════════════════════════════════════════════════════════════════
// MODEL: INNER SHELL GRID (Pack 3 / 2)
// Description: The first structural layer enclosing the Singularity.
// A tight triangular wireframe grid ensuring structural rigidity.
// Coordinate Space: LAT 0.22, High Elevation (400)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getInnerShellGrid(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const innerRadius = radius * 0.5; // Half size of full sphere
  const lats = 12;
  const lons = 24;

  for (let i = 0; i < lats; i++) {
    const latA1 = (i / lats) * Math.PI;
    const latA2 = ((i + 1) / lats) * Math.PI;

    for (let j = 0; j < lons; j++) {
      const lonA1 = (j / lons) * TAU;
      const lonA2 = ((j + 1) / lons) * TAU;

      const p1 = sphToCart(baseLat + Math.cos(latA1) * innerRadius, Math.sin(latA1) * Math.sin(lonA1) * innerRadius, elev + Math.sin(latA1) * Math.cos(lonA1) * 100);
      const p2 = sphToCart(baseLat + Math.cos(latA1) * innerRadius, Math.sin(latA1) * Math.sin(lonA2) * innerRadius, elev + Math.sin(latA1) * Math.cos(lonA2) * 100);
      
      lines.push({ p1, p2, colorMode: 1, width: 0.8 }); // Solid gray metal mesh
      
      if (i < lats - 1) {
        const p3 = sphToCart(baseLat + Math.cos(latA2) * innerRadius, Math.sin(latA2) * Math.sin(lonA1) * innerRadius, elev + Math.sin(latA2) * Math.cos(lonA1) * 100);
        lines.push({ p1, p2: p3, colorMode: 1, width: 0.8 });
        
        // Triangular cross-brace
        lines.push({ p1: p2, p2: p3, colorMode: 1, width: 0.3 }); 
      }
    }
  }

  return { lines, icons };
}
