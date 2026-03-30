// ═══════════════════════════════════════════════════════════════════════
// MODEL: DA VINCI RING (RIGHT) (Pack 2 / 2)
// Description: The glitched, unstable right hemisphere representing web3
// cybernetics and future digitization.
// Coordinate Space: LAT 0.06, Radius 0.005
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getDaVinciRingRight(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const segments = 60;

  // Right half of the circle (-PI/2 to PI/2)
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI - Math.PI / 2;
    const a2 = ((i + 1) / segments) * Math.PI - Math.PI / 2;
    
    // Add jitter/glitch based on sine harmonics
    let r1 = radius + (Math.sin(a1 * 20) * 0.0003);
    let r2 = radius + (Math.sin(a2 * 20) * 0.0003);

    // Occasional sharp artifact
    if (Math.random() > 0.9) r1 += 0.0008;

    const p1 = sphToCart(baseLat + Math.sin(a1) * r1, Math.cos(a1) * r1, elev);
    const p2 = sphToCart(baseLat + Math.sin(a2) * r2, Math.cos(a2) * r2, elev);

    // colorMode 2 = Cypherpunk/Technical coloring
    lines.push({ p1, p2, colorMode: 2, width: 1.5 });
    
    // Wireframe connection to perfect radius to show glitch displacement
    if (Math.random() > 0.7) {
        const pPerfect = sphToCart(baseLat + Math.sin(a1) * radius, Math.cos(a1) * radius, elev);
        lines.push({ p1, p2: pPerfect, colorMode: 2, width: 0.5 });
    }
  }

  icons.push({ p: sphToCart(baseLat, radius + 0.001, elev), char: "CYBER_SYNC_NODE", size: 10, type: 'text' });

  return { lines, icons };
}
