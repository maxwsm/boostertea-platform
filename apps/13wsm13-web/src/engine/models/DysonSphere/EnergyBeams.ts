// ═══════════════════════════════════════════════════════════════════════
// MODEL: ENERGY BEAMS (Pack 3 / 5)
// Description: Intense laser beams shooting out from the North and South
// poles of the Dyson Sphere, injecting logic into the rest of the Omniverse.
// Coordinate Space: LAT 0.22, High Elevation (400)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getEnergyBeams(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // The North Pole of the Dyson Sphere (Highest Elevation)
  const pNorthCore = sphToCart(baseLat + radius, 0, elev + 200);
  const pNorthBeam = sphToCart(baseLat + radius + 0.05, 0, elev + 600); // Shoots far away

  // The South Pole
  const pSouthCore = sphToCart(baseLat - radius, 0, elev - 200);
  const pSouthBeam = sphToCart(baseLat - radius - 0.05, 0, 0); // Shoots straight to the ground

  // Massive thick beam (Multiple lines to simulate blinding core)
  for(let i=0; i<5; i++) {
        const jitter = (Math.random() - 0.5) * 0.001;
        lines.push({ 
            p1: sphToCart(baseLat + radius + jitter, 0, elev + 200), 
            p2: sphToCart(baseLat + radius + 0.05 + jitter, 0, elev + 600), 
            colorMode: 3, 
            width: 3.0 
        });

        lines.push({ 
            p1: sphToCart(baseLat - radius + jitter, 0, elev - 200), 
            p2: sphToCart(baseLat - radius - 0.05 + jitter, 0, 0), 
            colorMode: 3, 
            width: 3.0 
        });
  }

  // Plasma vent rings at the poles
  const ventRadius = 0.002;
  const pRightN = sphToCart(baseLat + radius, ventRadius, elev + 200);
  const pLeftN = sphToCart(baseLat + radius, -ventRadius, elev + 200);
  lines.push({ p1: pLeftN, p2: pRightN, colorMode: 1, width: 4.0 });

  icons.push({ p: sphToCart(baseLat + radius + 0.02, 0, elev + 400), char: "> BACKEND_INJECTION_ACTIVE", size: 14, type: 'text' });

  return { lines, icons };
}
