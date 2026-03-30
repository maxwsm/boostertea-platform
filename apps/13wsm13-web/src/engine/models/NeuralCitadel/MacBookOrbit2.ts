// ═══════════════════════════════════════════════════════════════════════
// MODEL: MACBOOK ORBIT 2 (Pack 4 / 3)
// Description: The second cluster of floating MacBooks (Inner ring).
// Coordinate Space: LAT 0.38, Radius 0.015, Higher Elevation
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getMacBookOrbit2(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const orbitRadius = 0.015;
  const laptopCount = 3;

  for (let i = 0; i < laptopCount; i++) {
        const offsetAngle = (i / laptopCount) * TAU + Math.PI/4; // Phase shifted
        
        const originLat = baseLat + Math.cos(offsetAngle) * orbitRadius;
        const originLon = Math.sin(offsetAngle) * orbitRadius;
        
        const floatElev = elev + 80 + Math.cos(offsetAngle * 3) * 20;

        const p = sphToCart(originLat, originLon, floatElev);

        icons.push({ 
            p, 
            char: "MACBOOK_NODE_INNER", 
            size: 0, 
            type: 'obj',
            meta: { 
                isMacbook: true, 
                originLat, 
                originLon, 
                elev: floatElev,
                orbitSpeed: -0.003, // Counter-rotating
                lookAtCursor: true 
            } 
        });
        
        // Faint laser tether 
        lines.push({ p1: p, p2: sphToCart(originLat, originLon, elev), colorMode: 0, width: 0.5 });
  }

  return { lines, icons };
}
