// ═══════════════════════════════════════════════════════════════════════
// MODEL: LEFT ARM ORGANIC (Pack 2 / 6)
// Description: The biological, muscular structure of the left arm.
// It features two positions (horizontal and angled) following Da Vinci's
// original proportions, drawn with soft undulating curves.
// Coordinate Space: LAT 0.06 (Shoulder offset), Organic color
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getLeftArmOrganic(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Shoulder joint
  const sLat = baseLat - radius * 0.3; // Y offset (up)
  const sLon = -radius * 0.15;         // X offset (left)

  // Arm 1: Horizontal
  const segments = 20;
  for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;
      
      const lon1 = sLon - t1 * (radius * 0.85); // Reaching to the edge of the circle (left)
      const lon2 = sLon - t2 * (radius * 0.85);
      
      // Introduce an organic droop (muscle sag)
      const sag1 = Math.sin(t1 * Math.PI) * 0.0003;
      const sag2 = Math.sin(t2 * Math.PI) * 0.0003;
      
      const p1 = sphToCart(sLat + sag1, lon1, elev);
      const p2 = sphToCart(sLat + sag2, lon2, elev);
      
      lines.push({ p1, p2, colorMode: 1, width: 2.0 }); // Organic mode
  }

  // Arm 2: Angled Upward
  for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;
      
      const lon1 = sLon - t1 * (radius * 0.65);
      const lon2 = sLon - t2 * (radius * 0.65);
      
      // Moving upwards to touch the square's top corner / circle intersection
      const lat1 = sLat - t1 * (radius * 0.4);
      const lat2 = sLat - t2 * (radius * 0.4);
      
      const p1 = sphToCart(lat1, lon1, elev);
      const p2 = sphToCart(lat2, lon2, elev);
      
      lines.push({ p1, p2, colorMode: 1, width: 1.5 });
  }

  // Hand Nodes (Fingers placeholder)
  icons.push({ p: sphToCart(sLat, sLon - radius * 0.85, elev), char: "v", size: 6, type: 'rune', meta: { isBioHand: true } });
  icons.push({ p: sphToCart(sLat - radius * 0.4, sLon - radius * 0.65, elev), char: "v", size: 6, type: 'rune', meta: { isBioHand: true } });

  return { lines, icons };
}
