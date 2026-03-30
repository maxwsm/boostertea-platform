// ═══════════════════════════════════════════════════════════════════════
// MODEL: DYSON CORE (Pack 3 / 1)
// Description: The singularity at the exact center of the Dyson Sphere.
// Represents the Master AI backend engine. Highly dense and pulsating.
// Coordinate Space: LAT 0.22, High Elevation (400)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getDysonCore(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const coreRadius = 0.002;
  const segments = 24;

  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * Math.PI; // Latitude loops
        const a2 = ((i + 1) / segments) * Math.PI;

        for (let j = 0; j < segments; j++) {
            const lonA1 = (j / segments) * TAU; // Longitude loops
            
            const p1 = sphToCart(baseLat + Math.cos(a1) * coreRadius, Math.sin(a1) * Math.sin(lonA1) * coreRadius, elev + Math.sin(a1) * Math.cos(lonA1) * 50);
            
            // Generate dense exploding core lines
            if (Math.random() > 0.6) {
                const flareOut = sphToCart(baseLat + Math.cos(a1) * coreRadius * 1.5, Math.sin(a1) * Math.sin(lonA1) * coreRadius * 1.5, elev + Math.sin(a1) * Math.cos(lonA1) * 75);
                lines.push({ p1, p2: flareOut, colorMode: 3, width: 2.0 }); // Brilliant neon core
            } else {
                icons.push({ p: p1, char: "•", size: 6, type: 'rune', meta: { isCorePulse: true } });
            }
        }
  }

  icons.push({ p: sphToCart(baseLat, 0, elev), char: "{ SINGULARITY_NODE }", size: 0, type: 'obj', meta: { isEngineCore: true } });

  return { lines, icons };
}
