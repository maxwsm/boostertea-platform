// ═══════════════════════════════════════════════════════════════════════
// MODEL: CRT MONITOR SCREEN (Pack 5 / 11)
// Description: The convex glass front of the CRT monitor. Acts as the 
// surface where the terminal WebGL shader or text will be projected.
// Coordinate Space: LAT 0.27 (Center), Elev 25 (Attached slightly in front of casing)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCRTMonitorScreen(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const nodeLat = baseLat + 0.025; // Same base as casing
  const nodeLon = 0;
  const tElev = elev + 25; 

  const sizeX = 0.0045; // Slightly smaller than casing
  const sizeH = 18;
  const bulgeZ = -0.0005; // Convex bulge outwards (towards viewer)

  // 4 Screen Corners
  const pTL = sphToCart(nodeLat + bulgeZ, nodeLon - sizeX, tElev + sizeH*0.95);
  const pTR = sphToCart(nodeLat + bulgeZ, nodeLon + sizeX, tElev + sizeH*0.95);
  const pBL = sphToCart(nodeLat + bulgeZ, nodeLon - sizeX, tElev + sizeH*0.05);
  const pBR = sphToCart(nodeLat + bulgeZ, nodeLon + sizeX, tElev + sizeH*0.05);

  // Screen Bounds (Inner bezel)
  lines.push({ p1: pTL, p2: pTR, colorMode: 2, width: 2.0 }); // Green phosphor glow
  lines.push({ p1: pTR, p2: pBR, colorMode: 2, width: 2.0 });
  lines.push({ p1: pBR, p2: pBL, colorMode: 2, width: 2.0 });
  lines.push({ p1: pBL, p2: pTL, colorMode: 2, width: 2.0 });

  // Center glass bulge lines (Simulating convexity)
  const pCrossH1 = sphToCart(nodeLat + bulgeZ - 0.0002, nodeLon - sizeX, tElev + sizeH*0.5);
  const pCrossH2 = sphToCart(nodeLat + bulgeZ - 0.0002, nodeLon + sizeX, tElev + sizeH*0.5);
  lines.push({ p1: pCrossH1, p2: pCrossH2, colorMode: 2, width: 0.2 });

  // Anchor text for the CRT shader/logic
  icons.push({ 
      p: sphToCart(nodeLat + bulgeZ - 0.0005, nodeLon, tElev + sizeH*0.5), 
      char: "AWAITING DECRYPTION W-S-M", 
      size: 10, 
      type: 'text', 
      meta: { isCRTScreen: true, status: 'locked' } 
  });

  return { lines, icons };
}
