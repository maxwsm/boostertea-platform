// ═══════════════════════════════════════════════════════════════════════
// MODEL: LONGITUDE MERIDIANS (Pack 8 / 3)
// Description: The vertical slice lines intersecting at the North and 
// South poles. When rotating, these lines give the illusion of speed.
// Coordinate Space: Stepping Longitudes (0 to TAU)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getLongitudeMeridians(radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const sliceCount = 36; // 36 slices = every 10 degrees
  const segments = 40;

  for (let s = 0; s < sliceCount; s++) {
      const lon = (s / sliceCount) * TAU;
      
      for (let i = 0; i < segments; i++) {
          const lat1 = (i / segments) * Math.PI - (Math.PI / 2); // -90 to +90 degrees
          const lat2 = ((i + 1) / segments) * Math.PI - (Math.PI / 2);

          const p1 = sphToCart(lat1, lon, 0);
          const p2 = sphToCart(lat2, lon, 0);

          // Every 6th slice is thicker (Primary Meridian)
          const isPrimary = (s % 6 === 0);
          
          lines.push({ 
              p1, p2, 
              colorMode: isPrimary ? 1 : 0, 
              width: isPrimary ? 1.0 : 0.2 
          });
      }
  }

  return { lines, icons };
}
