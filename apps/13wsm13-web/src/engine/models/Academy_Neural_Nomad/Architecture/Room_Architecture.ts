// ═══════════════════════════════════════════════════════════════════════
// MODEL: ROOM - ARCHITECTURE (Pack 15 / 1)
// Description: A bright, spacious, and minimalist physical room designed 
// to showcase the 5 greatest achievements in modern human architecture.
// Coordinate Space: LAT 0.48, LON 0.17
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../../utils/math";

export function getRoomArchitecture(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rLat = baseLat + 0.48; 
  const rLon = 0.17; 
  const rElev = elev + 20;

  const roomRadius = 0.025;
  const objectCount = 5;

  // A pristine circular floor with elegant minimalist trim
  for (let i = 0; i < 72; i++) {
        const a1 = (i / 72) * TAU;
        const a2 = ((i + 1) / 72) * TAU;
        
        // Inner and Outer trim rings for a polished museum feel
        lines.push({ 
            p1: sphToCart(rLat + Math.cos(a1)*roomRadius, rLon + Math.sin(a1)*roomRadius, rElev), 
            p2: sphToCart(rLat + Math.cos(a2)*roomRadius, rLon + Math.sin(a2)*roomRadius, rElev), 
            colorMode: 1, width: 1.0 
        });
        lines.push({ 
            p1: sphToCart(rLat + Math.cos(a1)*(roomRadius*1.05), rLon + Math.sin(a1)*(roomRadius*1.05), rElev), 
            p2: sphToCart(rLat + Math.cos(a2)*(roomRadius*1.05), rLon + Math.sin(a2)*(roomRadius*1.05), rElev), 
            colorMode: 1, width: 2.0 
        });
  }

  // 5 Minimalist Floating Pedestals
  for (let i = 0; i < objectCount; i++) {
      const a = (i / objectCount) * TAU;
      const pMountLat = rLat + Math.cos(a) * (roomRadius * 0.7);
      const pMountLon = rLon + Math.sin(a) * (roomRadius * 0.7);
      
      const pBase = sphToCart(pMountLat, pMountLon, rElev + 5);
      const pTop = sphToCart(pMountLat, pMountLon, rElev + 8);

      lines.push({ p1: pBase, p2: pTop, colorMode: 1, width: 0.5 }); // Very thin, elegant stems

      icons.push({ 
          p: pTop, 
          char: "MOUNT_ARCH", 
          size: 0, 
          type: 'obj', 
          meta: { isPodium: true, objectId: i } 
      });
  }

  icons.push({ p: sphToCart(rLat, rLon, rElev + 60), char: "[ ACADEMY: TOP MODERN DESIGN ]", size: 14, type: 'text' });
  icons.push({ p: sphToCart(rLat, rLon, rElev + 50), char: "( VISIONS OF HUMANITY )", size: 8, type: 'text' });

  return { lines, icons };
}
