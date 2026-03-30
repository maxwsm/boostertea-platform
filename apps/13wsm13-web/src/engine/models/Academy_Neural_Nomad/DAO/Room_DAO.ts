// ═══════════════════════════════════════════════════════════════════════
// MODEL: ROOM - DAO (Pack 16 / 1)
// Description: The room architecture for the concept of Decentralized 
// Autonomous Organizations. Designed like a futuristic Roman Senate / Amphitheater.
// Coordinate Space: LAT 0.50, LON 0.20
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../../utils/math";

export function getRoomDAO(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rLat = baseLat + 0.50; 
  const rLon = 0.20; 
  const rElev = elev + 20;

  const roomRadius = 0.035;
  const objectCount = 9;

  // Amphitheater stepped floor
  for (let ring = 1; ring <= 3; ring++) {
        const radius = roomRadius * (ring / 3);
        const zLvl = rElev + (3 - ring) * 2; // Steps go down towards center

        for (let i = 0; i < 48; i++) {
            const a1 = (i / 48) * TAU;
            const a2 = ((i + 1) / 48) * TAU;
            lines.push({ 
                p1: sphToCart(rLat + Math.cos(a1)*radius, rLon + Math.sin(a1)*radius, zLvl), 
                p2: sphToCart(rLat + Math.cos(a2)*radius, rLon + Math.sin(a2)*radius, zLvl), 
                colorMode: 2, width: 1.0 
            });
        }
  }

  // 9 Mounts scattered around the parliament
  for (let i = 0; i < objectCount; i++) {
      const a = (i / objectCount) * TAU;
      const innerRad = roomRadius * 0.5;
      const pMountLat = rLat + Math.cos(a) * innerRad;
      const pMountLon = rLon + Math.sin(a) * innerRad;
      
      const pBase = sphToCart(pMountLat, pMountLon, rElev);
      const pTop = sphToCart(pMountLat, pMountLon, rElev + 10);

      lines.push({ p1: pBase, p2: pTop, colorMode: 2, width: 2.0 });

      icons.push({ 
          p: pTop, 
          char: "MOUNT_DAO", 
          size: 0, 
          type: 'obj', 
          meta: { isPodium: true, objectId: i } 
      });
  }

  icons.push({ p: sphToCart(rLat, rLon, rElev + 70), char: "[ ACADEMY: DECENTRALIZED AUTONOMOUS ORGS ]", size: 14, type: 'text' });
  icons.push({ p: sphToCart(rLat, rLon, rElev + 60), char: "( THE FUTURE OF CORPORATIONS )", size: 8, type: 'text' });

  return { lines, icons };
}
