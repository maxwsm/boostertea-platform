// ═══════════════════════════════════════════════════════════════════════
// MODEL: X-RAY SCANNER ARM (Pack 6 / 7)
// Description: The massive cybernetic arm holding the scanner.
// Anchored to the edge of the sphere, reaching out towards the user's cursor.
// Coordinate Space: LAT 0.55 (Far back anchor), High Elevation
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getXRayScannerArm(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const anchorLat = baseLat + 0.04; // Anchored at the extreme back
  const anchorLon = 0;
  const anchorElev = elev + 200;

  // Joint 1 (Midway)
  const j1Lat = baseLat + 0.02;
  const j1Lon = -0.01;
  const j1Elev = elev + 150;

  // The End Effector (Scanner Head, driven by JS logic later, but we draw default state)
  const headLat = baseLat; // Center of wasteland
  const headLon = 0;
  const headElev = elev + 100;

  const pAnchor = sphToCart(anchorLat, anchorLon, anchorElev);
  const pJ1 = sphToCart(j1Lat, j1Lon, j1Elev);
  const pHead = sphToCart(headLat, headLon, headElev);

  // Thick mechanical arm
  lines.push({ p1: pAnchor, p2: pJ1, colorMode: 2, width: 4.0 });
  lines.push({ p1: pJ1, p2: pHead, colorMode: 2, width: 2.5 });

  // Hydraulics parallel to Arm 1
  lines.push({ 
      p1: sphToCart(anchorLat, anchorLon-0.001, anchorElev-5), 
      p2: sphToCart(j1Lat, j1Lon-0.001, j1Elev-5), 
      colorMode: 2, width: 1.0 
  });

  icons.push({ p: pJ1, char: "O", size: 12, type: 'rune', meta: { isCyberJoint: true } });
  icons.push({ p: pAnchor, char: "[ X-RAY GANTRY ]", size: 10, type: 'text' });
  
  // Pivot node for dynamic animation
  icons.push({ p: pHead, char: "SCANNER_HEAD", size: 0, type: 'obj', meta: { isScannerHead: true } });

  return { lines, icons };
}
