// ═══════════════════════════════════════════════════════════════════════
// MODEL: MACBOOK ORBIT 3 (Pack 4 / 4)
// Description: The third and final ring of floating MacBooks (Core ring).
// Very close to the absolute center, acting as monitors for the Contract.
// Coordinate Space: LAT 0.38, Radius 0.005, Highest Elevation
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getMacBookOrbit3(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const orbitRadius = 0.005;
  const laptopCount = 3;

  for (let i = 0; i < laptopCount; i++) {
        const offsetAngle = (i / laptopCount) * TAU + Math.PI; 
        
        const originLat = baseLat + Math.cos(offsetAngle) * orbitRadius;
        const originLon = Math.sin(offsetAngle) * orbitRadius;
        
        const floatElev = elev + 120 + Math.sin(offsetAngle * 2) * 10;

        const p = sphToCart(originLat, originLon, floatElev);

        icons.push({ 
            p, 
            char: "MACBOOK_NODE_CORE", 
            size: 0, 
            type: 'obj',
            meta: { 
                isMacbook: true, 
                originLat, 
                originLon, 
                elev: floatElev,
                orbitSpeed: 0.01, // Fast spin
                lookAtCursor: true 
            } 
        });
  }

  return { lines, icons };
}
