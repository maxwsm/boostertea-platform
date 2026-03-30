// ═══════════════════════════════════════════════════════════════════════
// MODEL: SOLAR PANELS (Pack 3 / 4)
// Description: Massive floating geometric panels orbiting the outer layer 
// of the Dyson sphere to capture the "code energy" radiating from the core.
// Coordinate Space: LAT 0.22, High Elevation (400)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getSolarPanels(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const panelCount = 8;
  const pRadius = radius * 1.25; // Outside the cage

  for (let i = 0; i < panelCount; i++) {
        // Distribute panels evenly around the equator of the sphere
        const angle = (i / panelCount) * TAU;
        
        const latBase = baseLat + Math.cos(angle) * pRadius;
        const lonBase = Math.sin(angle) * pRadius;
        const panelElev = elev; // Equator level

        // Each panel is a large floating rectangular plate
        const pSizeLat = 0.003;
        const pSizeElev = 25;

        // Draw the 4 corners of the panel, angled towards the singularity (0,0)
        // For simplicity in wireframe, we just draw orthogonal plates currently
        const pA = sphToCart(latBase - pSizeLat, lonBase - pSizeLat, panelElev + pSizeElev);
        const pB = sphToCart(latBase + pSizeLat, lonBase - pSizeLat, panelElev + pSizeElev);
        const pC = sphToCart(latBase + pSizeLat, lonBase + pSizeLat, panelElev - pSizeElev);
        const pD = sphToCart(latBase - pSizeLat, lonBase + pSizeLat, panelElev - pSizeElev);

        lines.push({ p1: pA, p2: pB, colorMode: 1, width: 2.0 });
        lines.push({ p1: pB, p2: pC, colorMode: 1, width: 2.0 });
        lines.push({ p1: pC, p2: pD, colorMode: 1, width: 2.0 });
        lines.push({ p1: pD, p2: pA, colorMode: 1, width: 2.0 });

        // Internal crossbar
        lines.push({ p1: pA, p2: pC, colorMode: 0, width: 0.5 });
        lines.push({ p1: pB, p2: pD, colorMode: 0, width: 0.5 });

        // Text branding on the panel
        icons.push({ p: sphToCart(latBase, lonBase, panelElev + pSizeElev + 10), char: "[ ABSORB_NODE_" + i + " ]", size: 8, type: 'text' });
  }

  return { lines, icons };
}
