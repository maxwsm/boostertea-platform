// ═══════════════════════════════════════════════════════════════════════
// MODEL: X-RAY SCANNER CONE (Pack 6 / 8)
// Description: The volumetric light beam projecting down from the scanner
// eye onto the sand, acting as an intersection mask.
// Coordinate Space: Originates at ScannerHead
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getXRayScannerCone(headLat: number, headLon: number, headElev: number, groundElev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const scanRadius = 0.008; // How wide the circle on the ground is
  const segments = 16;
  
  const pEye = sphToCart(headLat, headLon, headElev);

  // Draw the projection cone
  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        // Points on the ground
        const pG1 = sphToCart(headLat + Math.cos(a1)*scanRadius, headLon + Math.sin(a1)*scanRadius, groundElev);
        const pG2 = sphToCart(headLat + Math.cos(a2)*scanRadius, headLon + Math.sin(a2)*scanRadius, groundElev);

        // Ground Ring
        lines.push({ p1: pG1, p2: pG2, colorMode: 3, width: 1.5 }); // Scan color (usually green/cyan)
        
        // Ray from eye to ground (Faint volumetric)
        lines.push({ p1: pEye, p2: pG1, colorMode: 3, width: 0.3 });
  }

  // Scanning grid on the floor
  lines.push({ 
      p1: sphToCart(headLat - scanRadius, headLon, groundElev), 
      p2: sphToCart(headLat + scanRadius, headLon, groundElev), 
      colorMode: 3, width: 0.5 
  });
  lines.push({ 
      p1: sphToCart(headLat, headLon - scanRadius, groundElev), 
      p2: sphToCart(headLat, headLon + scanRadius, groundElev), 
      colorMode: 3, width: 0.5 
  });

  return { lines, icons };
}
