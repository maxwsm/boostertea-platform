// ═══════════════════════════════════════════════════════════════════════
// MODEL: MACBOOK ORBIT 1 (Pack 4 / 2)
// Description: The first cluster of floating MacBooks orbiting the outer 
// perimeter of the Citadel. These act as LookAt pivot nodes.
// Coordinate Space: LAT 0.38, Radius 0.025, Sine Wave Elevation
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getMacBookOrbit1(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const orbitRadius = 0.025;
  const laptopCount = 3;

  for (let i = 0; i < laptopCount; i++) {
        const offsetAngle = (i / laptopCount) * TAU;
        
        const originLat = baseLat + Math.cos(offsetAngle) * orbitRadius;
        const originLon = Math.sin(offsetAngle) * orbitRadius;
        
        const floatElev = elev + 50 + Math.sin(offsetAngle * 4) * 30; // Buoyancy Math

        const p = sphToCart(originLat, originLon, floatElev);

        icons.push({ 
            p, 
            char: "MACBOOK_NODE_OUTER", 
            size: 0, 
            type: 'obj',
            meta: { 
                isMacbook: true, 
                originLat, 
                originLon, 
                elev: floatElev,
                orbitSpeed: 0.005,
                lookAtCursor: true // Trigger for Mona Lisa tracking
            } 
        });
        
        // Faint laser tether to the ground
        lines.push({ p1: p, p2: sphToCart(originLat, originLon, elev), colorMode: 0, width: 0.5 });
  }

  return { lines, icons };
}
