// ═══════════════════════════════════════════════════════════════════════
// MODEL: DEAD PROJECT TOMB 1 (Pack 6 / 2)
// Description: A massive stone slab memorializing a failed 2017 ICO.
// Protrudes violently from the dune surface.
// Coordinate Space: LAT 0.50 (Far left)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getDeadProjectTomb1(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const tLat = baseLat - 0.01;
  const tLon = -0.02; // Far Left
  const tElev = elev - 5; // Embedded in the sand slightly

  const width = 0.003;
  const depth = 0.001;
  const height = 40;

  // Render brutalist rectangular slab (Tombstone)
  const pFL = sphToCart(tLat - depth, tLon - width, tElev);
  const pFR = sphToCart(tLat - depth, tLon + width, tElev);
  const pBL = sphToCart(tLat + depth, tLon - width, tElev);
  const pBR = sphToCart(tLat + depth, tLon + width, tElev);

  const pFL_T = sphToCart(tLat - depth, tLon - width, tElev + height);
  const pFR_T = sphToCart(tLat - depth, tLon + width, tElev + height);
  const pBL_T = sphToCart(tLat + depth, tLon - width, tElev + height);
  const pBR_T = sphToCart(tLat + depth, tLon + width, tElev + height);

  // Pillars
  lines.push({ p1: pFL, p2: pFL_T, colorMode: 1, width: 2.0 });
  lines.push({ p1: pFR, p2: pFR_T, colorMode: 1, width: 2.0 });
  lines.push({ p1: pBL, p2: pBL_T, colorMode: 1, width: 2.0 });
  lines.push({ p1: pBR, p2: pBR_T, colorMode: 1, width: 2.0 });

  // Top cap
  lines.push({ p1: pFL_T, p2: pFR_T, colorMode: 1, width: 3.0 });
  lines.push({ p1: pFR_T, p2: pBR_T, colorMode: 1, width: 1.0 });
  lines.push({ p1: pBR_T, p2: pBL_T, colorMode: 1, width: 3.0 });
  lines.push({ p1: pBL_T, p2: pFL_T, colorMode: 1, width: 1.0 });

  icons.push({ p: sphToCart(tLat - depth - 0.0005, tLon, tElev + height - 10), char: "[ 2017 ICO HYPE ]", size: 12, type: 'text' });
  icons.push({ p: sphToCart(tLat - depth - 0.0005, tLon, tElev + height - 20), char: "R.I.P", size: 10, type: 'text' });

  return { lines, icons };
}
