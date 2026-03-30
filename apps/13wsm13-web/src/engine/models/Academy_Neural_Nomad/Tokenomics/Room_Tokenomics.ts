// ═══════════════════════════════════════════════════════════════════════
// MODEL: ROOM - TOKENOMICS (Pack 11 / 1)
// Description: The architectural structure for the Tokenomics Room inside
// the Neural Nomad Academy. Contains 5 podium mounts for the objects.
// Coordinate Space: LAT 0.40, LON 0.05
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../../utils/math";

export function getRoomTokenomics(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rLat = baseLat + 0.40; 
  const rLon = 0.05; 
  const rElev = elev + 20;

  const roomRadius = 0.02;
  const objectCount = 5;

  // Floor Ring
  for (let i = 0; i < 36; i++) {
        const a1 = (i / 36) * TAU;
        const a2 = ((i + 1) / 36) * TAU;
        const p1 = sphToCart(rLat + Math.cos(a1)*roomRadius, rLon + Math.sin(a1)*roomRadius, rElev);
        const p2 = sphToCart(rLat + Math.cos(a2)*roomRadius, rLon + Math.sin(a2)*roomRadius, rElev);
        lines.push({ p1, p2, colorMode: 1, width: 2.0 });
  }

  // 5 Podium mounts
  for (let i = 0; i < objectCount; i++) {
      const a = (i / objectCount) * TAU;
      const pMountLat = rLat + Math.cos(a) * (roomRadius * 0.7); // Inside the ring
      const pMountLon = rLon + Math.sin(a) * (roomRadius * 0.7);
      
      const pBase = sphToCart(pMountLat, pMountLon, rElev);
      const pTop = sphToCart(pMountLat, pMountLon, rElev + 10); // Small pillar

      lines.push({ p1: pBase, p2: pTop, colorMode: 2, width: 3.0 }); // Golden/Yellow hue usually for tokenomics

      // Logic hook for the MasterCanvas to mount 1 of the 5 objects here
      icons.push({ 
          p: pTop, 
          char: "MOUNT_TOKENOMICS", 
          size: 0, 
          type: 'obj', 
          meta: { isPodium: true, objectId: i } 
      });
  }

  // Room Hologram Title
  icons.push({ p: sphToCart(rLat, rLon, rElev + 60), char: "[ ACADEMY: ABUNDANCE & TOKENOMICS ]", size: 14, type: 'text' });

  return { lines, icons };
}
