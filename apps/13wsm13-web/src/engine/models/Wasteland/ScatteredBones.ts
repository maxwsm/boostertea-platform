// ═══════════════════════════════════════════════════════════════════════
// MODEL: SCATTERED BONES (Pack 6 / 5)
// Description: Dozens of dead HTML tags and code snippets acting like
// bleached bones in the desert sun.
// Coordinate Space: LAT 0.50 (Random distribution across dunes)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getScatteredBones(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const count = 30;
  const spreadLat = 0.04;
  const spreadLon = 0.04;

  const deadTags = ["</div>", "<console.log>", "TODO: fix", "ERR_CONNECTION", "404", "NaN", "undefined"];

  for (let i = 0; i < count; i++) {
        const lat = baseLat + (Math.random() - 0.5) * spreadLat;
        const lon = (Math.random() - 0.5) * spreadLon;
        
        // Randomly rotate the text to look discarded
        const rot = Math.random() * 360;
        const z = elev + Math.random() * 5; // Resting on the shifting dunes
        
        const p = sphToCart(lat, lon, z);

        icons.push({ 
            p, 
            char: deadTags[Math.floor(Math.random() * deadTags.length)], 
            size: 6 + Math.random() * 6, 
            type: 'text',
            meta: { isBone: true, rotate: rot }
        });
  }

  return { lines, icons };
}
