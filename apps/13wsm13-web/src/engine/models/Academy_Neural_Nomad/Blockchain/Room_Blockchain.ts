// ═══════════════════════════════════════════════════════════════════════
// MODEL: ROOM - BLOCKCHAIN (Pack 14 / 1)
// Description: Industrial, cryptographic architecture for the Blockchain 
// exhibit. 5 robust, block-like podiums.
// Coordinate Space: LAT 0.46, LON 0.14
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../../utils/math";

export function getRoomBlockchain(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rLat = baseLat + 0.46; 
  const rLon = 0.14; 
  const rElev = elev + 20;

  const roomRadius = 0.02;
  const objectCount = 5;

  // Heavy hexagonal structure
  for (let i = 0; i < 6; i++) {
        const a1 = (i / 6) * TAU;
        const a2 = ((i + 1) / 6) * TAU;
        // Floor
        lines.push({ 
            p1: sphToCart(rLat + Math.cos(a1)*roomRadius, rLon + Math.sin(a1)*roomRadius, rElev), 
            p2: sphToCart(rLat + Math.cos(a2)*roomRadius, rLon + Math.sin(a2)*roomRadius, rElev), 
            colorMode: 1, width: 3.0 
        });
  }

  // 5 Rigid Mounts
  for (let i = 0; i < objectCount; i++) {
      const a = (i / objectCount) * TAU;
      const pMountLat = rLat + Math.cos(a) * (roomRadius * 0.8);
      const pMountLon = rLon + Math.sin(a) * (roomRadius * 0.8);
      
      const pBase = sphToCart(pMountLat, pMountLon, rElev);
      const pTop = sphToCart(pMountLat, pMountLon, rElev + 10);

      // Cybernetic pillars
      lines.push({ p1: pBase, p2: pTop, colorMode: 3, width: 4.0 }); 

      icons.push({ 
          p: pTop, 
          char: "MOUNT_BLOCKCHAIN", 
          size: 0, 
          type: 'obj', 
          meta: { isPodium: true, objectId: i } 
      });
  }

  icons.push({ p: sphToCart(rLat, rLon, rElev + 60), char: "[ ACADEMY: BLOCKCHAIN PROTOCOLS ]", size: 14, type: 'text' });
  icons.push({ p: sphToCart(rLat, rLon, rElev + 50), char: "( TRUSTLESS SYSTEM ARCHITECTURE )", size: 8, type: 'text' });

  return { lines, icons };
}
