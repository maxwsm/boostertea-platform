// ═══════════════════════════════════════════════════════════════════════
// MODEL: ROOM - NEUROCHEMISTRY (Pack 12 / 1)
// Description: The room architecture simulating an expanded human brain.
// Contains 9 floating podiums connected by faint neural pathways.
// Coordinate Space: LAT 0.42, LON 0.08
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../../utils/math";

export function getRoomNeuroChem(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rLat = baseLat + 0.42; 
  const rLon = 0.08; 
  const rElev = elev + 20;

  const roomRadius = 0.025;
  const objectCount = 9;

  // Draw Neural Connections across the floor joining all 9 mounts
  for(let i=0; i<objectCount; i++) {
      for(let j=i+1; j<objectCount; j++) {
          // Skip some connections to make it look like a neural net, not a star
          if (Math.random() > 0.4) continue;

          const a1 = (i / objectCount) * TAU;
          const a2 = (j / objectCount) * TAU;

          const p1 = sphToCart(rLat + Math.cos(a1)*roomRadius, rLon + Math.sin(a1)*roomRadius, rElev);
          const p2 = sphToCart(rLat + Math.cos(a2)*roomRadius, rLon + Math.sin(a2)*roomRadius, rElev);

          // Faint synapse connection
          lines.push({ p1, p2, colorMode: 0, width: 0.3 });
      }
  }

  // 9 Neural Podiums
  for (let i = 0; i < objectCount; i++) {
      const a = (i / objectCount) * TAU;
      const pMountLat = rLat + Math.cos(a) * roomRadius;
      const pMountLon = rLon + Math.sin(a) * roomRadius;
      
      const pBase = sphToCart(pMountLat, pMountLon, rElev);
      const pTop = sphToCart(pMountLat, pMountLon, rElev + 15);

      lines.push({ p1: pBase, p2: pTop, colorMode: 3, width: 1.0 }); // Electric Blue dendrite mount

      icons.push({ 
          p: pTop, 
          char: "MOUNT_NEURO", 
          size: 0, 
          type: 'obj', 
          meta: { isPodium: true, objectId: i } 
      });
  }

  icons.push({ p: sphToCart(rLat, rLon, rElev + 70), char: "[ ACADEMY: APPLIED NEUROCHEMISTRY ]", size: 14, type: 'text' });
  icons.push({ p: sphToCart(rLat, rLon, rElev + 60), char: "( SYNAPTIC ENGINEERING FOR SUCCESS )", size: 8, type: 'text' });

  return { lines, icons };
}
