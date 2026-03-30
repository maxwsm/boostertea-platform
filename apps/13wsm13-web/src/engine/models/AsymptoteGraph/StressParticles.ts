// ═══════════════════════════════════════════════════════════════════════
// MODEL: STRESS PARTICLES (Pack 7 / 13)
// Description: Atmospheric physics particles (simulating failing RAM bits)
// that cluster heavily around the chaotic spikes in the curve.
// Coordinate Space: LAT 0.65
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getStressParticles(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Cluster around Spike 1
  const cluster1Lon = -0.01;
  const cluster1Elev = elev + 40;

  // Cluster around Spike 2
  const cluster2Lon = 0.015;
  const cluster2Elev = elev + 60;

  // Cluster around Spike 3
  const cluster3Lon = 0.025;
  const cluster3Elev = elev + 120;

  const makeCluster = (cLon: number, cElev: number, count: number) => {
      for(let i=0; i<count; i++) {
          const lon = cLon + (Math.random() - 0.5) * 0.005;
          const z = cElev + (Math.random() - 0.5) * 40;
          
          icons.push({ 
              p: sphToCart(baseLat, lon, z), 
              char: "!", 
              size: 4 + Math.random()*6, 
              type: 'rune', 
              meta: { isStressParticle: true, floatSpeed: Math.random() * 0.02 } 
          });
      }
  };

  makeCluster(cluster1Lon, cluster1Elev, 15);
  makeCluster(cluster2Lon, cluster2Elev, 20);
  makeCluster(cluster3Lon, cluster3Elev, 30); // Heaviest crash

  return { lines, icons };
}
