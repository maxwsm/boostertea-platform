// ═══════════════════════════════════════════════════════════════════════
// MODEL: ZENITH MANIFESTO (Pack 4 / 15)
// Description: The absolutely massive final branding text.
// Hidden until all 13 Lego blocks snap perfectly into place.
// Coordinate Space: LAT 0.38, Highest Elevation (300)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getZenithManifesto(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const zElev = elev + 300;
  const pCenter = sphToCart(baseLat + 0.02, 0, zElev);

  // Faint structural grid behind the text
  const size = 0.01;
  const pA = sphToCart(baseLat + 0.02 - size, -size, zElev - 5);
  const pB = sphToCart(baseLat + 0.02 + size, size, zElev - 5);
  lines.push({ p1: pA, p2: pB, colorMode: 0, width: 0.2 });

  // The Zenith Texts
  icons.push({ 
      p: pCenter, 
      char: "13WSM13", 
      size: 48, 
      type: 'text', 
      meta: { isZenithManifesto: true, hidden: true } // Controlled by Gravity Engine state
  });

  icons.push({ 
      p: sphToCart(baseLat + 0.025, 0, zElev - 30), 
      char: "GAME CHANGER CREATOR", 
      size: 24, 
      type: 'text', 
      meta: { isZenithManifesto: true, hidden: true } 
  });

  icons.push({ 
      p: sphToCart(baseLat + 0.028, 0, zElev - 50), 
      char: "SYNDICATE NEURO-FORT REBUILT.", 
      size: 14, 
      type: 'text', 
      meta: { isZenithManifesto: true, hidden: true } 
  });

  return { lines, icons };
}
