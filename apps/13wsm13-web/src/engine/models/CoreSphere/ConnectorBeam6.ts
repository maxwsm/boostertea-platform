// ═══════════════════════════════════════════════════════════════════════
// MODEL: CONNECTOR BEAM 6 (Pack 8 / 15)
// Description: The longest and deepest connector tracing from the genesis
// Core all the way into the deep background (Wasteland & Asymptote Limit).
// Looks like a chaotic crack dividing the sphere floor.
// Coordinate Space: Draws line from (0,0,0) -> (LAT 0.60, LON 0)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getConnectorBeam6(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pSingularity = sphToCart(0, 0, 0); 
  
  // Far end of the universe
  const segments = 20;
  const tLat = 0.60;
  
  let pPrev = pSingularity;

  // Render as a jagged lightning bolt stretching to the edge of the world
  for(let i=1; i<=segments; i++){
        const lat = (i/segments) * tLat;
        // Jitter longitude radically as it gets further
        const lon = (Math.random() - 0.5) * (i/segments) * 0.05; 
        
        const pCurrent = sphToCart(lat, lon, 0);
        
        lines.push({ p1: pPrev, p2: pCurrent, colorMode: 3, width: (segments-i)*0.2 + 0.5 }); // Thins out over distance
        
        pPrev = pCurrent;
  }

  icons.push({ p: sphToCart(0.50, 0, 10), char: "<< MEMORY_LEAK_INTO_WASTELAND", size: 8, type: 'text', meta: { colorMode: 3 } });
  icons.push({ p: sphToCart(0.60, 0, 50), char: "--- TIMELINE DIVISION ---", size: 10, type: 'text' });

  return { lines, icons };
}
