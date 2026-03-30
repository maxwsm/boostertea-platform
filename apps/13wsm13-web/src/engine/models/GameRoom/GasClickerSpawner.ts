// ═══════════════════════════════════════════════════════════════════════
// MODEL: GAS CLICKER SPAWNER (Pack 5 / 6)
// Description: An invisible anchor logic point that continuously spawns
// "Gas Crystals" which float downwards. The user must click them quickly.
// Coordinate Space: LAT 0.27 (Right Side), Elev 150
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getGasClickerSpawner(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed on the right side of the arcade platform
  const nodeLat = baseLat - 0.015;
  const nodeLon = 0.015;
  const spawnElev = elev + 150; // Spawns high and falls down

  const pCenter = sphToCart(nodeLat, nodeLon, spawnElev);

  // A very faint funnel structure showing where the gas comes from
  for (let i = 0; i < 4; i++) {
        const pEdge = sphToCart(nodeLat + (Math.cos(i) * 0.005), nodeLon + (Math.sin(i) * 0.005), spawnElev + 20);
        lines.push({ p1: pCenter, p2: pEdge, colorMode: 0, width: 0.5 });
  }

  // Logic anchor
  icons.push({ 
      p: pCenter, 
      char: "GAS_SPAWNER_CORE", 
      size: 0, 
      type: 'obj', 
      meta: { isGasSpawner: true, rate: 2, lastSpawnTime: 0 } // Rate: 2 shards per second
  });

  return { lines, icons };
}
