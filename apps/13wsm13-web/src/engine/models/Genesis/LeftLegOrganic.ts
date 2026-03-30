// ═══════════════════════════════════════════════════════════════════════
// MODEL: LEFT LEG ORGANIC (Pack 2 / 8)
// Description: The biological, muscular structure of the left leg.
// Features anatomical curvature of the calf and thigh.
// Coordinate Space: LAT 0.06 (Pelvis offset), Organic color
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getLeftLegOrganic(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Pelvis joint (Left)
  const pLat = baseLat + radius * 0.15; // Y offset (down)
  const pLon = -radius * 0.1;           // X offset (left)

  // Leg: Placed at an angle outward
  const segments = 25;
  for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;
      
      const lon1 = pLon - t1 * (radius * 0.3);
      const lon2 = pLon - t2 * (radius * 0.3);
      
      const lat1 = pLat + t1 * (radius * 0.75); // Reaching bottom of square/circle
      const lat2 = pLat + t2 * (radius * 0.75);
      
      // Anatomical knee and calf bulge (Left side of the leg)
      const bulge1 = Math.sin(t1 * Math.PI) * 0.0002;
      const bulge2 = Math.sin(t2 * Math.PI) * 0.0002;
      
      const p1 = sphToCart(lat1, lon1 - bulge1, elev);
      const p2 = sphToCart(lat2, lon2 - bulge2, elev);
      
      // Inner line (bone/muscle definition)
      const pInner1 = sphToCart(lat1, lon1 + bulge1*0.5, elev);
      const pInner2 = sphToCart(lat2, lon2 + bulge2*0.5, elev);
      
      lines.push({ p1, p2, colorMode: 1, width: 2.5 });
      lines.push({ p1: pInner1, p2: pInner2, colorMode: 1, width: 0.8 });
  }

  // Foot (Plantar arc)
  const pFoot = sphToCart(pLat + radius * 0.75, pLon - radius * 0.3, elev);
  const pToe = sphToCart(pLat + radius * 0.75, pLon - radius * 0.35, elev);
  lines.push({ p1: pFoot, p2: pToe, colorMode: 1, width: 1.5 });

  icons.push({ p: pFoot, char: "•", size: 5, type: 'rune', meta: { isBioFoot: true } });

  return { lines, icons };
}
