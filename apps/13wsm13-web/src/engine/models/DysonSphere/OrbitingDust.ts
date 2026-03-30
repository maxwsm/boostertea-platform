// ═══════════════════════════════════════════════════════════════════════
// MODEL: ORBITING DUST (Pack 3 / 14)
// Description: Cometary tails and micro-particles caught in the gravitational 
// pull of the orbiting formulas.
// Coordinate Space: LAT 0.22, Nested inside the sphere's orbits
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getOrbitingDust(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const dustCount = 40;
  // Map of the predefined orbits
  const orbitRadii = [0.012, 0.015, 0.018, 0.022];

  for (let i = 0; i < dustCount; i++) {
        const radiusChoice = orbitRadii[Math.floor(Math.random() * orbitRadii.length)];
        const angle = Math.random() * TAU;
        
        let zElev = elev;
        // Apply Tilt logic roughly matching the orbits
        if (radiusChoice === 0.015) zElev += Math.sin(angle) * 30;
        if (radiusChoice === 0.018) zElev += Math.cos(angle) * 60;

        const p = sphToCart(baseLat + Math.cos(angle) * radiusChoice, Math.sin(angle) * radiusChoice, zElev);

        icons.push({
            p,
            char: ["0", "1", "x", "+", ".", ","][Math.floor(Math.random() * 6)],
            size: 6,
            type: 'rune',
            meta: {
                isOrbitDust: true,
                orbitSpeed: 0.001 + Math.random() * 0.003,
                angle: angle,
                radius: radiusChoice
            }
        });
  }

  return { lines, icons };
}
