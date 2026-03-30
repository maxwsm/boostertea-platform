// ═══════════════════════════════════════════════════════════════════════
// MODEL: CRT KEYBOARD MATRIX (Pack 5 / 12)
// Description: The heavy mechanical keyboard sitting in front of the CRT.
// Contains distinct keys used for the W-S-M decryption sequence.
// Coordinate Space: LAT 0.27 (Center, Front of CRT), Elev 20
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCRTKeyboardMatrix(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const kbLat = baseLat + 0.015; // In front of the CRT monitor
  const kbLon = 0;
  const kbElev = elev + 20;

  const kbWidth = 0.006;
  const kbDepth = 0.003;
  const kbHeight = 2; // Flat block

  // Base Plate
  const pTL = sphToCart(kbLat, kbLon - kbWidth, kbElev + kbHeight);
  const pTR = sphToCart(kbLat, kbLon + kbWidth, kbElev + kbHeight);
  const pBL = sphToCart(kbLat + kbDepth, kbLon - kbWidth, kbElev); // Sloped towards user
  const pBR = sphToCart(kbLat + kbDepth, kbLon + kbWidth, kbElev);

  lines.push({ p1: pTL, p2: pTR, colorMode: 1, width: 1.5 });
  lines.push({ p1: pTR, p2: pBR, colorMode: 1, width: 1.5 });
  lines.push({ p1: pBR, p2: pBL, colorMode: 1, width: 1.5 });
  lines.push({ p1: pBL, p2: pTL, colorMode: 1, width: 1.5 });

  // Grid for keys
  const rows = 4;
  const cols = 12;

  for (let r=1; r<rows; r++) {
      const pR1 = sphToCart(kbLat + (r/rows)*kbDepth, kbLon - kbWidth, kbElev + kbHeight*(1 - r/rows));
      const pR2 = sphToCart(kbLat + (r/rows)*kbDepth, kbLon + kbWidth, kbElev + kbHeight*(1 - r/rows));
      lines.push({ p1: pR1, p2: pR2, colorMode: 1, width: 0.5 });
  }

  for (let c=1; c<cols; c++) {
      const pC1 = sphToCart(kbLat, kbLon - kbWidth + (c/cols)*(kbWidth*2), kbElev + kbHeight);
      const pC2 = sphToCart(kbLat + kbDepth, kbLon - kbWidth + (c/cols)*(kbWidth*2), kbElev);
      lines.push({ p1: pC1, p2: pC2, colorMode: 1, width: 0.5 });
  }

  // Interactive Key Triggers
  icons.push({ p: sphToCart(kbLat + kbDepth*0.3, kbLon - kbWidth*0.5, kbElev + 1), char: "W", size: 6, type: 'rune', meta: { isKeyTrigger: true, key: 'W' } });
  icons.push({ p: sphToCart(kbLat + kbDepth*0.6, kbLon - kbWidth*0.2, kbElev + 0.5), char: "S", size: 6, type: 'rune', meta: { isKeyTrigger: true, key: 'S' } });
  icons.push({ p: sphToCart(kbLat + kbDepth*0.9, kbLon + kbWidth*0.1, kbElev), char: "M", size: 6, type: 'rune', meta: { isKeyTrigger: true, key: 'M' } });

  return { lines, icons };
}
