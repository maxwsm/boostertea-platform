// ═══════════════════════════════════════════════════════════════════════
// MODEL: TREADMILL DUST (Pack 8 / 8)
// Description: Ambient particles that exist in the camera's near-plane.
// They fly backward rapidly relative to the user's scroll speed, giving 
// a massive sense of velocity moving along the sphere.
// Coordinate Space: Close to camera (0,0)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getTreadmillDust(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const count = 40;
  
  for (let i = 0; i < count; i++) {
        // Random field around the camera view segment
        const lat = (Math.random() - 0.5) * 0.05; 
        const lon = (Math.random() - 0.5) * 0.05;
        const z = -50 + Math.random() * 200; // Floating at various minor depths
        
        const p = sphToCart(lat, lon, z); // Very small radius, close to camera

        icons.push({ 
            p, 
            char: ".", 
            size: 4 + Math.random()*8, 
            type: 'rune', 
            // The renderer will multiply velocity by scrollDelta to make them zip past
            meta: { isSpeedDust: true, velocityLayer: 1.0 + Math.random() * 3.0 } 
        });
  }

  return { lines, icons };
}
