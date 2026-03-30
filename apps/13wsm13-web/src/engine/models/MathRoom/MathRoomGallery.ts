// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH ROOM GALLERY (Pack 10 / 1)
// Description: The architectural room bounding the mathematical paintings.
// A dark, brutalist pentagon space inside the Neural Citadel.
// Coordinate Space: LAT 0.38, LON 0.05, Elevated
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getMathRoomGallery(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rLat = baseLat; 
  const rLon = 0.05; // Offset from main Citadel core
  const rElev = elev + 50;

  const radius = 0.015;
  const height = 80;
  const sides = 5; // A Pentagon (5 paintings)

  for (let i = 0; i < sides; i++) {
        const a1 = (i / sides) * TAU;
        const a2 = ((i + 1) / sides) * TAU;

        const pB1 = sphToCart(rLat + Math.cos(a1)*radius, rLon + Math.sin(a1)*radius, rElev);
        const pB2 = sphToCart(rLat + Math.cos(a2)*radius, rLon + Math.sin(a2)*radius, rElev);
        
        const pT1 = sphToCart(rLat + Math.cos(a1)*radius, rLon + Math.sin(a1)*radius, rElev + height);
        const pT2 = sphToCart(rLat + Math.cos(a2)*radius, rLon + Math.sin(a2)*radius, rElev + height);

        // Floor / Ceiling Rings
        lines.push({ p1: pB1, p2: pB2, colorMode: 1, width: 2.0 });
        lines.push({ p1: pT1, p2: pT2, colorMode: 1, width: 2.0 });

        // Columns
        lines.push({ p1: pB1, p2: pT1, colorMode: 1, width: 1.0 });

        // Identify the center of the wall to place paintings later
        const wallCenterLat = rLat + (Math.cos(a1) + Math.cos(a2)) * radius * 0.5;
        const wallCenterLon = rLon + (Math.sin(a1) + Math.sin(a2)) * radius * 0.5;
        const wallCenterZ = rElev + height * 0.5;

        // Meta hooks for placing the Frames exactly on the walls
        icons.push({ 
            p: sphToCart(wallCenterLat, wallCenterLon, wallCenterZ), 
            char: "", 
            size: 0, 
            type: 'obj', 
            meta: { isGalleryWall: true, wallId: i + 1, normalAngle: a1 + (Math.PI / sides) } 
        });
  }

  // Floating sign
  icons.push({ p: sphToCart(rLat, rLon, rElev + height - 10), char: "[ HALL OF PURE MATH ]", size: 14, type: 'text' });

  return { lines, icons };
}
