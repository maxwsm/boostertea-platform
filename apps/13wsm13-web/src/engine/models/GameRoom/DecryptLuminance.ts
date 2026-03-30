// ═══════════════════════════════════════════════════════════════════════
// MODEL: DECRYPT LUMINANCE (Pack 5 / 13)
// Description: A glowing beacon/halo that explodes from the CRT monitor
// when the player correctly types W-S-M on the keyboard.
// Coordinate Space: LAT 0.27, Elev 25 (Overlaid on screen)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getDecryptLuminance(baseLat: number, elev: number, isSolved: boolean): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  if (!isSolved) return { lines, icons }; // Render nothing if puzzle is locked

  const nodeLat = baseLat + 0.024; // Just in front of screen
  const nodeLon = 0;
  const tElev = elev + 35; // Center of screen
  
  const flareRadius = 0.01;
  const rays = 12;

  const pCenter = sphToCart(nodeLat, nodeLon, tElev);

  // Volumetric light rays exploding outward
  for(let i=0; i<rays; i++) {
        const a = (i/rays) * TAU;
        
        // Push lines outward along X and Z roughly (since screen faces -Y)
        const pOuter = sphToCart(nodeLat - 0.005, nodeLon + Math.cos(a)*flareRadius, tElev + Math.sin(a)*flareRadius*1000); // 1000 is elevation scale
        
        lines.push({ p1: pCenter, p2: pOuter, colorMode: 3, width: 2.0 }); // Green flare lines
  }

  // Large success text projection
  icons.push({ 
      p: sphToCart(nodeLat - 0.008, nodeLon, tElev), 
      char: "ACCESS GRANTED. ARCHIVE OPEN.", 
      size: 20, 
      type: 'text', 
      meta: { isSuccessText: true } 
  });

  return { lines, icons };
}
