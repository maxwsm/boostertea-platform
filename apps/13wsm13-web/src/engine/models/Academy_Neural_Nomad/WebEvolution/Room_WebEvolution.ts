// ═══════════════════════════════════════════════════════════════════════
// MODEL: ROOM - WEB EVOLUTION (Pack 13 / 1)
// Description: The room architecture for Web2->Web3 Transition.
// Designed like a museum exhibit with 9 focal areas illustrating analogies.
// Coordinate Space: LAT 0.44, LON 0.11
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../../utils/math";

export function getRoomWebEvolution(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rLat = baseLat + 0.44; 
  const rLon = 0.11; 
  const rElev = elev + 20;

  const roomRadius = 0.03;
  const objectCount = 9;

  // Draw 2 concentric exhibit rings
  for(let ring=1; ring<=2; ring++) {
      const currentRadius = roomRadius * (ring * 0.5);
      for (let i = 0; i < 36; i++) {
          const a1 = (i / 36) * TAU;
          const a2 = ((i + 1) / 36) * TAU;
          const p1 = sphToCart(rLat + Math.cos(a1)*currentRadius, rLon + Math.sin(a1)*currentRadius, rElev);
          const p2 = sphToCart(rLat + Math.cos(a2)*currentRadius, rLon + Math.sin(a2)*currentRadius, rElev);
          lines.push({ p1, p2, colorMode: 1, width: 2.0 });
      }
  }

  // 9 Historical Mounts
  for (let i = 0; i < objectCount; i++) {
      // Alternate objects between inner and outer ring
      const radiusToUse = (i % 2 === 0) ? (roomRadius * 0.5) : roomRadius;
      const a = (i / objectCount) * TAU;
      
      const pMountLat = rLat + Math.cos(a) * radiusToUse;
      const pMountLon = rLon + Math.sin(a) * radiusToUse;
      
      const pBase = sphToCart(pMountLat, pMountLon, rElev);
      const pTop = sphToCart(pMountLat, pMountLon, rElev + 8); // Low pedestals

      lines.push({ p1: pBase, p2: pTop, colorMode: 1, width: 4.0 });

      icons.push({ 
          p: pTop, 
          char: "MOUNT_EVOL", 
          size: 0, 
          type: 'obj', 
          meta: { isPodium: true, objectId: i } 
      });
  }

  icons.push({ p: sphToCart(rLat, rLon, rElev + 60), char: "[ ACADEMY: INTERNET EVOLUTION ]", size: 14, type: 'text' });

  return { lines, icons };
}
