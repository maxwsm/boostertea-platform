// ═══════════════════════════════════════════════════════════════════════
// MODEL: WASTELAND MONOLITH (Pack 6 / 13)
// Description: A massive, pristine black slab standing perfectly intact 
// amidst the ruined dunes. Represents the 5% that survive.
// Coordinate Space: LAT 0.50 (Dead center of the wasteland)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getWastelandMonolith(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const mLat = baseLat + 0.02; // Slightly towards the front
  const mLon = 0; // Absolute center
  const mElev = elev; // Based on ground

  const width = 0.01;
  const depth = 0.002;
  const height = 120; // Very tall

  // The perfect brutalist monolith boundaries
  const pFL = sphToCart(mLat - depth, mLon - width, mElev);
  const pFR = sphToCart(mLat - depth, mLon + width, mElev);
  const pBL = sphToCart(mLat + depth, mLon - width, mElev);
  const pBR = sphToCart(mLat + depth, mLon + width, mElev);

  const pFL_T = sphToCart(mLat - depth, mLon - width, mElev + height);
  const pFR_T = sphToCart(mLat - depth, mLon + width, mElev + height);
  const pBL_T = sphToCart(mLat + depth, mLon - width, mElev + height);
  const pBR_T = sphToCart(mLat + depth, mLon + width, mElev + height);

  lines.push({ p1: pFL, p2: pFL_T, colorMode: 2, width: 3.0 });
  lines.push({ p1: pFR, p2: pFR_T, colorMode: 2, width: 3.0 });
  lines.push({ p1: pBL, p2: pBL_T, colorMode: 2, width: 3.0 });
  lines.push({ p1: pBR, p2: pBR_T, colorMode: 2, width: 3.0 });

  lines.push({ p1: pFL_T, p2: pFR_T, colorMode: 2, width: 4.0 });
  lines.push({ p1: pFR_T, p2: pBR_T, colorMode: 2, width: 2.0 });
  lines.push({ p1: pBR_T, p2: pBL_T, colorMode: 2, width: 4.0 });
  lines.push({ p1: pBL_T, p2: pFL_T, colorMode: 2, width: 2.0 });

  // Engraved data
  icons.push({ p: sphToCart(mLat - depth - 0.0005, mLon, mElev + height*0.8), char: "95% OF WEB3 IS A GRAVEYARD.", size: 16, type: 'text' });
  icons.push({ p: sphToCart(mLat - depth - 0.0005, mLon, mElev + height*0.7), char: "13WSM13 BUILDS FOR THE 5%.", size: 16, type: 'text' });
  
  // Data flowing through the monolith (neon veins)
  const vein1Top = sphToCart(mLat - depth, mLon - width*0.5, mElev + height);
  const vein1Bot = sphToCart(mLat - depth, mLon - width*0.5, mElev);
  lines.push({ p1: vein1Top, p2: vein1Bot, colorMode: 3, width: 1.0 });

  return { lines, icons };
}
