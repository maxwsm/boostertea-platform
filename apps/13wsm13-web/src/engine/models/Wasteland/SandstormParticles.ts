// ═══════════════════════════════════════════════════════════════════════
// MODEL: SANDSTORM PARTICLES (Pack 6 / 6)
// Description: Horizontally sweeping wind particles simulating a harsh 
// desert environment, causing "data loss".
// Coordinate Space: LAT 0.50 (Covers entire Wasteland block)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getSandstormParticles(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pCount = 50;
  const spreadLat = 0.05;
  const spreadLon = 0.05;

  for (let i = 0; i < pCount; i++) {
        const lat = baseLat + (Math.random() - 0.5) * spreadLat;
        const lon = (Math.random() - 0.5) * spreadLon;
        const z = elev + Math.random() * 40; // Rises up into the sky

        const p = sphToCart(lat, lon, z);

        icons.push({ 
            p, 
            char: "-", 
            size: 8, 
            type: 'rune',
            meta: { 
                isSandstorm: true, 
                windX: 0.005 + Math.random() * 0.005, // Fast horizontal movement
                windY: (Math.random() - 0.5) * 0.001
            }
        });
  }

  return { lines, icons };
}
