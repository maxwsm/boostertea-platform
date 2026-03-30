// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH - HARDY RAMANUJAN CIRCLE METHOD (Pack 10 / 4)
// Description: A 3D abstraction of the asymptotic partition formula. 
// Visualized as concentric rings that fragment into complex nodes as 
// they approach the singularity boundary (q -> 1).
// Coordinate Space: Isolated Origin (0,0,0) inside the painting view
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../utils/math";

export function getHardyRamanujanCircle(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const origin: P3D = { x: 0, y: 0, z: 0 };
  const maxOrbits = 8;
  const baseRadius = 50; // Use direct un-scaled Cartesian coords for isolated scenes

  // Draw concentric orbits representing the terms of the Rademacher expansion
  for (let k = 1; k <= maxOrbits; k++) {
        const radius = baseRadius * (1 - Math.exp(-k * 0.5)); // Approaching singularity (1)
        const nodeDensity = 6 * k; // More complex fractions (h/k) on outer rings

        let pPrev: P3D | null = null;
        let pFirst: P3D | null = null;

        for (let i = 0; i < nodeDensity; i++) {
            const angle = (i / nodeDensity) * TAU;
            // Introduce mathematical "noise" reflecting complex exponential approximation
            const jitterR = radius + Math.sin(k * angle * 3) * (k * 2); 
            
            const px = origin.x + Math.cos(angle) * jitterR;
            const py = origin.y + Math.sin(angle) * jitterR;
            const pz = origin.z + (Math.sin(angle * k) * 10); // 3D wave

            const pCurrent: P3D = { x: px, y: py, z: pz };

            if (pPrev) {
                // The closer to the singularity (higher k), the darker/finer the lines
                lines.push({ p1: pPrev, p2: pCurrent, colorMode: (k < 3) ? 1 : 2, width: Math.max(0.2, 2.0/k) });
            } else {
                pFirst = pCurrent;
            }

            // Roots of unity abstraction (singularities)
            if (i % 3 === 0 && k > 4) {
                icons.push({ p: pCurrent, char: "e(2πi/k)", size: 6, type: 'rune', meta: { isSingularityNode: true } });
            }

            pPrev = pCurrent;
        }

        // Close the loop
        if (pFirst && pPrev) {
            lines.push({ p1: pPrev, p2: pFirst, colorMode: (k < 3) ? 1 : 2, width: Math.max(0.2, 2.0/k) });
        }
  }

  return { lines, icons };
}
