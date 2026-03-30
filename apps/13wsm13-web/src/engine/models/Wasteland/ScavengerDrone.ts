// ═══════════════════════════════════════════════════════════════════════
// MODEL: SCAVENGER DRONE (Pack 6 / 14)
// Description: A small autonomous physics drone flying above the dunes,
// searching the ruins for reusable code.
// Coordinate Space: LAT 0.50, Hover Elev 30-50
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getScavengerDrone(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const dLat = baseLat - 0.02; // Starts slightly offset
  const dLon = -0.01;
  const dElev = elev + 40;

  const pCenter = sphToCart(dLat, dLon, dElev);

  // Drone Geometry (Pyramid Chassis)
  const size = 0.001;
  const pTop = sphToCart(dLat, dLon, dElev + 3);
  const pFL = sphToCart(dLat - size, dLon - size, dElev);
  const pFR = sphToCart(dLat - size, dLon + size, dElev);
  const pBR = sphToCart(dLat + size, dLon + size, dElev);
  const pBL = sphToCart(dLat + size, dLon - size, dElev);

  lines.push({ p1: pFL, p2: pFR, colorMode: 1, width: 1.0 });
  lines.push({ p1: pFR, p2: pBR, colorMode: 1, width: 1.0 });
  lines.push({ p1: pBR, p2: pBL, colorMode: 1, width: 1.0 });
  lines.push({ p1: pBL, p2: pFL, colorMode: 1, width: 1.0 });

  lines.push({ p1: pTop, p2: pFL, colorMode: 1, width: 1.0 });
  lines.push({ p1: pTop, p2: pFR, colorMode: 1, width: 1.0 });
  lines.push({ p1: pTop, p2: pBL, colorMode: 1, width: 1.0 });
  lines.push({ p1: pTop, p2: pBR, colorMode: 1, width: 1.0 });

  // Floating object meta
  icons.push({ 
      p: pCenter, 
      char: "DRONE", 
      size: 0, 
      type: 'obj', 
      meta: { isScavengerDrone: true, vX: 0.01, vY: -0.005 } // Engine handles movement 
  });
  
  // Laser sight to the ground
  icons.push({ p: sphToCart(dLat, dLon, dElev - 2), char: ".", size: 2, type: 'rune', meta: { isDroneLaser: true } });

  return { lines, icons };
}
