// ═══════════════════════════════════════════════════════════════════════
// MODEL: LATITUDE RINGS (Pack 8 / 2)
// Description: The parallel horizontal bands that give depth and massive 
// scale to the rolling sphere effect.
// Coordinate Space: Stepping Latitudes from Pole to Equator
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getLatitudeRings(radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const ringCount = 12; // 6 above, 6 below equator
  const segments = 60;

  for (let r = 1; r <= ringCount; r++) {
      // Space rings logarithmically or linearly across the latitude (from 0 to PI/2)
      const latP = (r / ringCount) * (Math.PI / 2);
      
      for (let i = 0; i < segments; i++) {
            // Draw segments but leave gaps to make it look like a technical schematic
            if (i % 4 === 0) continue; 

            const a1 = (i / segments) * TAU;
            const a2 = ((i + 1) / segments) * TAU;

            // Positive Latitude (North Hemisphere)
            const pN1 = sphToCart(latP, a1, 0); 
            const pN2 = sphToCart(latP, a2, 0);
            lines.push({ p1: pN1, p2: pN2, colorMode: 0, width: 0.5 }); // Faint

            // Negative Latitude (South Hemisphere)
            const pS1 = sphToCart(-latP, a1, 0); 
            const pS2 = sphToCart(-latP, a2, 0);
            lines.push({ p1: pS1, p2: pS2, colorMode: 0, width: 0.5 });
      }
  }

  return { lines, icons };
}
