// ═══════════════════════════════════════════════════════════════════════
// MODEL: X-RAY SCANNER LENS (Pack 6 / 9)
// Description: The mechanical eye housing that emits the X-Ray beam.
// It rotates and tilts based on mouse movement.
// Coordinate Space: Local to ScannerHead
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getXRayScannerLens(headLat: number, headLon: number, headElev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const lensRadius = 0.0015;
  const segments = 12;

  // Draw the optical metal ring
  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        // Horizontally flat ring at the Head location
        const p1 = sphToCart(headLat + Math.cos(a1)*lensRadius, headLon + Math.sin(a1)*lensRadius, headElev);
        const p2 = sphToCart(headLat + Math.cos(a2)*lensRadius, headLon + Math.sin(a2)*lensRadius, headElev);

        // Top edge of the drum
        const pT1 = sphToCart(headLat + Math.cos(a1)*lensRadius, headLon + Math.sin(a1)*lensRadius, headElev + 5);
        const pT2 = sphToCart(headLat + Math.cos(a2)*lensRadius, headLon + Math.sin(a2)*lensRadius, headElev + 5);

        lines.push({ p1, p2, colorMode: 2, width: 2.0 });
        lines.push({ p1: pT1, p2: pT2, colorMode: 2, width: 2.0 });
        lines.push({ p1, p2: pT1, colorMode: 2, width: 1.0 });
  }

  // Cross aperture
  const pA = sphToCart(headLat - lensRadius, headLon, headElev);
  const pB = sphToCart(headLat + lensRadius, headLon, headElev);
  const pC = sphToCart(headLat, headLon - lensRadius, headElev);
  const pD = sphToCart(headLat, headLon + lensRadius, headElev);
  
  lines.push({ p1: pA, p2: pB, colorMode: 1, width: 1.0 });
  lines.push({ p1: pC, p2: pD, colorMode: 1, width: 1.0 });

  return { lines, icons };
}
