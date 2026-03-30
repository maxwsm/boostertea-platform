// ═══════════════════════════════════════════════════════════════════════
// MODEL: CYBER SPINE (Pack 2 / 5)
// Description: The right half of the spinal core, modeled as a straight,
// rigid monolithic cable with precise mechanical joint nodes.
// Coordinate Space: LAT 0.06, Central Y axis
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCyberSpine(baseLat: number, length: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const segments = 20; // Fewer segments because it's straight
  
  for (let i = 0; i < segments; i++) {
    const y1 = -length + (i / segments) * (length * 2);
    const y2 = -length + ((i + 1) / segments) * (length * 2);
    
    // Rigid fixed offset to the right side
    const xOffset1 = 0.0005;
    const xOffset2 = 0.0005;
    
    const p1 = sphToCart(baseLat + y1, xOffset1, elev);
    const p2 = sphToCart(baseLat + y2, xOffset2, elev);

    lines.push({ p1, p2, colorMode: 2, width: 3.0 }); // Thick mechanical rod

    // Mechanical joint hashes
    const pOut = sphToCart(baseLat + y1, xOffset1 + 0.0003, elev);
    lines.push({ p1, p2: pOut, colorMode: 2, width: 1.0 });

    if (i % 4 === 0) {
        icons.push({ p: pOut, char: "-", size: 8, type: 'rune', meta: { isJoint: true } });
    }
  }

  return { lines, icons };
}
