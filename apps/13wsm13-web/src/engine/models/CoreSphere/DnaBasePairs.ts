// ═══════════════════════════════════════════════════════════════════════
// MODEL: DNA BASE PAIRS (Pack 8 / 6)
// Description: The structural rungs connecting Alpha and Beta Helix.
// In 13WSM13, these represent bridges between pure biology and pure code.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getDnaBasePairs(elevZ: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const height = 1500; 
  const loops = 8;
  const hRadius = 0.005; 
  
  const rungCount = 60; // How many ladder steps

  for (let i = 0; i <= rungCount; i++) {
        const t = i / rungCount;
        
        // Alpha coordinates
        const a1 = t * loops * TAU; 
        const alLat = Math.cos(a1) * hRadius;
        const alLon = Math.sin(a1) * hRadius;

        // Beta coordinates (PI shift)
        const a2 = t * loops * TAU + Math.PI; 
        const beLat = Math.cos(a2) * hRadius;
        const beLon = Math.sin(a2) * hRadius;

        const z = (elevZ - height/2) + t * height;
        
        const pAlpha = sphToCart(alLat, alLon, z); 
        const pBeta = sphToCart(beLat, beLon, z); 

        // Draw the bridge
        lines.push({ p1: pAlpha, p2: pBeta, colorMode: 1, width: 0.8 });

        // Add bridging text (e.g. A-T, C-G mapped to code)
        if (i % 3 === 0) {
            const bridgeTexts = ["0x13", "VDS", "A-T", "G-C", "NaN", "SYN"];
            const char = bridgeTexts[Math.floor(Math.random() * bridgeTexts.length)];
            
            // Middle point
            const pCenter = sphToCart(0, 0, z);
            icons.push({ p: pCenter, char: char, size: 7, type: 'text' });
        }
  }

  return { lines, icons };
}
