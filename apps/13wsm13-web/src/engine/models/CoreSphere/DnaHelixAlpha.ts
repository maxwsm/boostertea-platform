// ═══════════════════════════════════════════════════════════════════════
// MODEL: DNA HELIX ALPHA (Pack 8 / 4)
// Description: The left swirling strand of the Founder's DNA code.
// Placed at the exact camera coordinate center (0,0,0).
// Elevates heavily along the Z-axis.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getDnaHelixAlpha(elevZ: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const height = 1500; // Extremely tall central pillar
  const loops = 8;
  const hRadius = 0.005; // Size of the helix (using Lat/Lon scale)
  
  const segments = 100;

  let prevPoint = sphToCart(0, 0, elevZ - height/2); // Fallback point

  for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * loops * TAU;
        
        // Swirl around 0,0
        const hLat = Math.cos(angle) * hRadius;
        const hLon = Math.sin(angle) * hRadius;
        
        const z = (elevZ - height/2) + t * height;
        
        // We use small radius to keep it localized to camera
        const pCurrent = sphToCart(hLat, hLon, z); 

        if (i > 0) {
            lines.push({ p1: prevPoint, p2: pCurrent, colorMode: 3, width: 2.5 }); // Alpha is often Neon Green/Blue
        }
        
        prevPoint = pCurrent;

        // DNA data cells
        if (i % 5 === 0) {
            icons.push({ p: pCurrent, char: "1", size: 6, type: 'rune', meta: { isDnaData: true } });
        }
  }

  return { lines, icons };
}
