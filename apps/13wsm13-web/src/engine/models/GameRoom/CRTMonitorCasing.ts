// ═══════════════════════════════════════════════════════════════════════
// MODEL: CRT MONITOR CASING (Pack 5 / 10)
// Description: The heavy retro-future television box enclosing the 
// Arcade Terminal game.
// Coordinate Space: LAT 0.27 (Center, pushing Back), Elev 25
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCRTMonitorCasing(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed Back-Center of the Arcade
  const nodeLat = baseLat + 0.025;
  const nodeLon = 0;
  const tElev = elev + 25; // Sitting on the floor

  // Outer Box Size
  const sizeX = 0.005; // Width
  const sizeZ = 0.006; // Depth (protrudes wildly backward)
  const sizeH = 20;

  const pF_TL = sphToCart(nodeLat - sizeX, nodeLon - sizeX, tElev + sizeH);
  const pF_TR = sphToCart(nodeLat - sizeX, nodeLon + sizeX, tElev + sizeH);
  const pF_BL = sphToCart(nodeLat - sizeX, nodeLon - sizeX, tElev);
  const pF_BR = sphToCart(nodeLat - sizeX, nodeLon + sizeX, tElev);

  const pB_TL = sphToCart(nodeLat + sizeZ, nodeLon - sizeX*0.7, tElev + sizeH*0.8);
  const pB_TR = sphToCart(nodeLat + sizeZ, nodeLon + sizeX*0.7, tElev + sizeH*0.8);
  const pB_BL = sphToCart(nodeLat + sizeZ, nodeLon - sizeX*0.7, tElev + sizeH*0.2);
  const pB_BR = sphToCart(nodeLat + sizeZ, nodeLon + sizeX*0.7, tElev + sizeH*0.2);

  // Front Face
  lines.push({ p1: pF_TL, p2: pF_TR, colorMode: 1, width: 3.0 });
  lines.push({ p1: pF_TR, p2: pF_BR, colorMode: 1, width: 3.0 });
  lines.push({ p1: pF_BR, p2: pF_BL, colorMode: 1, width: 3.0 });
  lines.push({ p1: pF_BL, p2: pF_TL, colorMode: 1, width: 3.0 });

  // Connectors (Depth)
  lines.push({ p1: pF_TL, p2: pB_TL, colorMode: 1, width: 1.5 });
  lines.push({ p1: pF_TR, p2: pB_TR, colorMode: 1, width: 1.5 });
  lines.push({ p1: pF_BL, p2: pB_BL, colorMode: 1, width: 1.5 });
  lines.push({ p1: pF_BR, p2: pB_BR, colorMode: 1, width: 1.5 });

  // Back Face (Small)
  lines.push({ p1: pB_TL, p2: pB_TR, colorMode: 1, width: 0.8 });
  lines.push({ p1: pB_TR, p2: pB_BR, colorMode: 1, width: 0.8 });
  lines.push({ p1: pB_BR, p2: pB_BL, colorMode: 1, width: 0.8 });
  lines.push({ p1: pB_BL, p2: pB_TL, colorMode: 1, width: 0.8 });

  // Ventilation grates on top
  for(let v = 1; v <= 4; v++) {
      const gOffset = v * (sizeZ * 0.15);
      lines.push({ 
          p1: sphToCart(nodeLat + gOffset, nodeLon - sizeX*0.5, tElev + sizeH), 
          p2: sphToCart(nodeLat + gOffset, nodeLon + sizeX*0.5, tElev + sizeH), 
          colorMode: 1, width: 0.5 
      });
  }

  return { lines, icons };
}
