// ═══════════════════════════════════════════════════════════════════════
// MODEL: CYBER SQUARE (Pack 2 / 3)
// Description: The square bounds of the Vitruvian geometry. Present 
// heavily on the right side and faintly on the left.
// Coordinate Space: LAT 0.06, Square Boundary inside Circle Radius
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCyberSquare(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Da Vinci's square intersects the circle
  const size = radius * 0.9;
  
  // 4 Corners: TL, TR, BR, BL
  const pTL = sphToCart(baseLat - size, -size, elev);
  const pTR = sphToCart(baseLat - size, size, elev);
  const pBR = sphToCart(baseLat + size, size, elev);
  const pBL = sphToCart(baseLat + size, -size, elev);

  // Top Edge
  lines.push({ p1: pTL, p2: pTR, colorMode: 2, width: 1.5 });
  // Bottom Edge
  lines.push({ p1: pBL, p2: pBR, colorMode: 2, width: 1.5 });
  // Right Edge (Full Cyber)
  lines.push({ p1: pTR, p2: pBR, colorMode: 2, width: 3.0 });
  // Left Edge (Faint Bio)
  lines.push({ p1: pTL, p2: pBL, colorMode: 1, width: 0.5 });

  // Right Edge measurement ticks
  for(let i=1; i<=5; i++) {
        const yFrac = -size + (size * 2 * (i/6));
        const tickRoot = sphToCart(baseLat + yFrac, size, elev);
        const tickEnd = sphToCart(baseLat + yFrac, size + 0.001, elev);
        lines.push({ p1: tickRoot, p2: tickEnd, colorMode: 2, width: 2.0 });
  }

  // Anchor text
  icons.push({ p: pTR, char: "x=1,y=1", size: 8, type: 'text' });
  icons.push({ p: pBR, char: "x=1,y=-1", size: 8, type: 'text' });

  return { lines, icons };
}
