// ═══════════════════════════════════════════════════════════════════════
// MODEL: ASYMPTOTE WALL (Pack 7 / 9)
// Description: The literal vertical limit that the curve approaches but 
// theoretically never touches. It's a massive, glowing, glitching wall.
// Coordinate Space: LAT 0.65, Far right edge (Lon 0.04)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getAsymptoteWall(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const wallLon = 0.04;
  const wallHeight = 250; // Massively tall

  const pBottom = sphToCart(baseLat, wallLon, elev);
  const pTop = sphToCart(baseLat, wallLon, elev + wallHeight);

  // The primary rigid asymptote line (Dashed vertically)
  const segments = 25;
  for (let i = 0; i < segments; i++) {
        if (i % 2 === 0) continue; // Dashed

        const p1 = sphToCart(baseLat, wallLon, elev + (i/segments)*wallHeight);
        const p2 = sphToCart(baseLat, wallLon, elev + ((i+1)/segments)*wallHeight);
        lines.push({ p1, p2, colorMode: 2, width: 3.0 });
  }

  // Cross-hatching hazard stripes indicating the boundary
  for (let i = 1; i < segments; i+=2) {
        const p1 = sphToCart(baseLat, wallLon, elev + (i/segments)*wallHeight);
        const pLeft = sphToCart(baseLat, wallLon - 0.002, elev + (i/segments)*wallHeight - 5);
        lines.push({ p1: pLeft, p2: p1, colorMode: 2, width: 1.0 });
  }

  icons.push({ p: sphToCart(baseLat, wallLon + 0.001, elev + wallHeight*0.5), char: "lim f(x) -> ∞", size: 16, type: 'text', meta: { rotate: -90 } });

  return { lines, icons };
}
