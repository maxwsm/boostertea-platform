// ═══════════════════════════════════════════════════════════════════════
// MODEL: WASTELAND BOUNDARY (Pack 6 / 15)
// Description: The fading edge where the physical desert polygon ends 
// and the void of the sphere takes over.
// Coordinate Space: LAT 0.50, Wide perimeter
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getWastelandBoundary(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const bRadius = 0.08; 
  const segments = 24;

  for (let i = 0; i < segments; i++) {
        // Dashed lines warning of map edge
        if (i % 2 === 0) continue; 

        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        const lat1 = baseLat + Math.cos(a1) * bRadius;
        const lon1 = Math.sin(a1) * bRadius;
        const p1 = sphToCart(lat1, lon1, elev);
        
        const lat2 = baseLat + Math.cos(a2) * bRadius;
        const lon2 = Math.sin(a2) * bRadius;
        const p2 = sphToCart(lat2, lon2, elev);

        lines.push({ p1, p2, colorMode: 0, width: 0.5 }); // Faint, warning line

        // Small digital beacons defining the fence
        icons.push({ p: p1, char: "x", size: 6, type: 'rune' });
  }

  // Fading text at the edge
  icons.push({ p: sphToCart(baseLat - bRadius - 0.01, 0, elev), char: "[ ZERO LIQUIDITY ENDPOINT ]", size: 10, type: 'text' });
  icons.push({ p: sphToCart(baseLat + bRadius + 0.01, 0, elev), char: "[ VOID ERROR ]", size: 10, type: 'text' });

  return { lines, icons };
}
