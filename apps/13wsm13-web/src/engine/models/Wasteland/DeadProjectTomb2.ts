// ═══════════════════════════════════════════════════════════════════════
// MODEL: DEAD PROJECT TOMB 2 (Pack 6 / 3)
// Description: A cracked, leaning tombstone memorializing a rug-pulled 
// NFT collection from 2021.
// Coordinate Space: LAT 0.50 (Center-right)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getDeadProjectTomb2(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const tLat = baseLat + 0.005;
  const tLon = 0.015; // Center-right
  const tElev = elev; 

  const width = 0.0025;
  const depth = 0.001;
  const height = 35;
  const lean = 0.004; // Leaning heavily to the right

  // Crack logic (split geometry halfway)
  const crackHeight = 20;

  const pFL = sphToCart(tLat - depth, tLon - width, tElev);
  const pFR = sphToCart(tLat - depth, tLon + width, tElev);
  
  const pFL_C = sphToCart(tLat - depth, tLon - width + lean*0.5, tElev + crackHeight);
  const pFR_C = sphToCart(tLat - depth, tLon + width + lean*0.5, tElev + crackHeight);

  const pFL_T = sphToCart(tLat - depth, tLon - width + lean, tElev + height);
  const pFR_T = sphToCart(tLat - depth, tLon + width + lean, tElev + height);

  // Draw Bottom half
  lines.push({ p1: pFL, p2: pFL_C, colorMode: 0, width: 2.0 });
  lines.push({ p1: pFR, p2: pFR_C, colorMode: 0, width: 2.0 });
  // Jagged crack across face
  lines.push({ p1: pFL_C, p2: sphToCart(tLat-depth, tLon, tElev+crackHeight-2), colorMode: 0, width: 3.0 });
  lines.push({ p1: sphToCart(tLat-depth, tLon, tElev+crackHeight-2), p2: pFR_C, colorMode: 0, width: 3.0 });

  // Draw Top half (offset / falling)
  const shiftOffset = 0.001; // Slipped sideways 
  lines.push({ p1: sphToCart(tLat - depth, tLon - width + lean*0.5 + shiftOffset, tElev + crackHeight), p2: pFL_T, colorMode: 0, width: 1.0 });
  lines.push({ p1: sphToCart(tLat - depth, tLon + width + lean*0.5 + shiftOffset, tElev + crackHeight), p2: pFR_T, colorMode: 0, width: 1.0 });
  lines.push({ p1: pFL_T, p2: pFR_T, colorMode: 0, width: 2.0 });

  icons.push({ p: sphToCart(tLat - depth - 0.0005, tLon, tElev + 10), char: "[ 2021 NFT RUG ]", size: 10, type: 'text' });

  return { lines, icons };
}
