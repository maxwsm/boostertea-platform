// ═══════════════════════════════════════════════════════════════════════
// MODEL: DNA HELIX BETA (Pack 8 / 5)
// Description: The right swirling strand of the Founder's DNA code.
// Exact opposite phase of Alpha. Represents chaotic code vs organized structure.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getDnaHelixBeta(elevZ: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const height = 1500; 
  const loops = 8;
  const hRadius = 0.005; 
  
  const segments = 100;

  let prevPoint = sphToCart(0, 0, elevZ - height/2);

  for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Shift phase by PI (180 degrees)
        const angle = t * loops * TAU + Math.PI; 
        
        const hLat = Math.cos(angle) * hRadius;
        const hLon = Math.sin(angle) * hRadius;
        
        const z = (elevZ - height/2) + t * height;
        
        const pCurrent = sphToCart(hLat, hLon, z); 

        if (i > 0) {
            lines.push({ p1: prevPoint, p2: pCurrent, colorMode: 2, width: 2.5 }); // Beta is Cyan/Different color
        }
        
        prevPoint = pCurrent;

        // DNA data cells
        if (i % 5 === 0) {
            icons.push({ p: pCurrent, char: "0", size: 6, type: 'rune', meta: { isDnaData: true } }); // Biological vs binary
        }
  }

  return { lines, icons };
}
