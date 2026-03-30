// ═══════════════════════════════════════════════════════════════════════
// MODEL: PAINTING FRAME (Pack 10 / 2)
// Description: The glowing neon frame holding each mathematical exhibit.
// Spawns 5 times inside the Gallery walls.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getPaintingFrame(centerLat: number, centerLon: number, elev: number, angle: number, title: string): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Create a 2D physical frame that rotates towards the center of the room
  const frameWidth = 0.006;
  const frameHeight = 35;
  const frameDepth = 0.001; // Protrudes slightly out of the wall

  // Points relative to the center of the wall
  const pRight = { lat: centerLat + Math.cos(angle - Math.PI/2)*frameWidth, lon: centerLon + Math.sin(angle - Math.PI/2)*frameWidth };
  const pLeft = { lat: centerLat + Math.cos(angle + Math.PI/2)*frameWidth, lon: centerLon + Math.sin(angle + Math.PI/2)*frameWidth };

  const pTR = sphToCart(pRight.lat, pRight.lon, elev + frameHeight/2);
  const pBR = sphToCart(pRight.lat, pRight.lon, elev - frameHeight/2);
  const pTL = sphToCart(pLeft.lat, pLeft.lon, elev + frameHeight/2);
  const pBL = sphToCart(pLeft.lat, pLeft.lon, elev - frameHeight/2);

  // Outer Box Frame (Electric/Glowing bounds)
  lines.push({ p1: pTL, p2: pTR, colorMode: 2, width: 3.0 });
  lines.push({ p1: pTR, p2: pBR, colorMode: 2, width: 3.0 });
  lines.push({ p1: pBR, p2: pBL, colorMode: 2, width: 3.0 });
  lines.push({ p1: pBL, p2: pTL, colorMode: 2, width: 3.0 });

  // Plaque below frame
  const plaqueLat = centerLat + Math.cos(angle)*frameDepth;
  const plaqueLon = centerLon + Math.sin(angle)*frameDepth;
  
  icons.push({ 
      p: sphToCart(plaqueLat, plaqueLon, elev - frameHeight/2 - 5), 
      char: title, 
      size: 10, 
      type: 'text' 
  });

  return { lines, icons };
}
