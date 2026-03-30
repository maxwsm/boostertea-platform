// ═══════════════════════════════════════════════════════════════════════
// MODEL: FLOATING RUNES (Pack 2 / 12)
// Description: Ancient biological/mystical symbols floating in the empty 
// space around the left hemisphere and left arm. Represents history.
// Coordinate Space: LAT 0.06, Left Hemisphere Volume
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getFloatingRunes(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const runeSet = ["ᚠ", "ᛟ", "ᛒ", "ᚷ", "ᛉ", "ᚹ", "ᛋ", "ᛞ", "ᛝ", "☿", "♃", "♄"];
  const runeCount = 15;

  for (let i = 0; i < runeCount; i++) {
      // Confine to the Left Quadrant (-X)
      const angle = Math.random() * Math.PI + Math.PI / 2;
      const rndRadius = Math.random() * radius;
      
      // Elev variation for depth
      const depth = elev + (Math.random() - 0.5) * 20;

      const p = sphToCart(baseLat + Math.cos(angle) * rndRadius, Math.sin(angle) * rndRadius, depth);
      
      icons.push({ 
          p, 
          char: runeSet[Math.floor(Math.random() * runeSet.length)], 
          size: 14 + Math.random() * 8, 
          type: 'rune',
          meta: { 
              isMysticRune: true,
              floatSpeed: Math.random() * 0.05
          }
      });
  }

  return { lines, icons };
}
