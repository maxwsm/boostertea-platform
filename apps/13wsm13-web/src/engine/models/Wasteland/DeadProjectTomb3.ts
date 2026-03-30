// ═══════════════════════════════════════════════════════════════════════
// MODEL: DEAD PROJECT TOMB 3 (Pack 6 / 4)
// Description: A completely destroyed DeFi protocol tombstone.
// Mostly shattered, sitting inside an impact crater in the sand.
// Coordinate Space: LAT 0.50 (Far Right)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getDeadProjectTomb3(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const tLat = baseLat - 0.015;
  const tLon = 0.025; // Far Right
  const tElev = elev - 10; // Crater depth

  // The Crater
  const craterRadius = 0.004;
  for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const pOuter = sphToCart(tLat + Math.cos(a)*craterRadius, tLon + Math.sin(a)*craterRadius, elev + 2); // Lip
      const pInner = sphToCart(tLat + Math.cos(a)*craterRadius*0.5, tLon + Math.sin(a)*craterRadius*0.5, tElev); // Core
      lines.push({ p1: pOuter, p2: pInner, colorMode: 1, width: 0.5 });
  }

  // The shattered stump of the tomb
  const width = 0.002;
  const height = 15;

  const pL = sphToCart(tLat, tLon - width, tElev);
  const pR = sphToCart(tLat, tLon + width, tElev);
  const pLT = sphToCart(tLat, tLon - width, tElev + height); // Jagged top
  const pRT = sphToCart(tLat, tLon + width, tElev + height*0.3);

  lines.push({ p1: pL, p2: pLT, colorMode: 1, width: 2.0 });
  lines.push({ p1: pR, p2: pRT, colorMode: 1, width: 2.0 });
  lines.push({ p1: pLT, p2: pRT, colorMode: 1, width: 3.0 }); // Jagged diagonal cut

  icons.push({ p: sphToCart(tLat, tLon, tElev + 30), char: "[ 2022 DEFI EXPLOIT ]", size: 9, type: 'text' });

  return { lines, icons };
}
