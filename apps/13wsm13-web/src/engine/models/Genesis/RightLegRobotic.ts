// ═══════════════════════════════════════════════════════════════════════
// MODEL: RIGHT LEG ROBOTIC (Pack 2 / 9)
// Description: The cybernetic right leg structure. Strict straight lines,
// angular knee joint, and heavy industrial casing.
// Coordinate Space: LAT 0.06 (Pelvis offset), Cyber color
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getRightLegRobotic(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Pelvis joint (Right)
  const pLat = baseLat + radius * 0.15; // Y offset (down)
  const pLon = radius * 0.1;            // X offset (right)

  // Cyber Knee
  const kneeLat = pLat + radius * 0.35;
  const kneeLon = pLon + radius * 0.15;
  const pKnee = sphToCart(kneeLat, kneeLon, elev);
  
  // Cyber Foot
  const footLat = pLat + radius * 0.75;
  const footLon = pLon + radius * 0.3;
  const pFoot = sphToCart(footLat, footLon, elev);

  const pPelvis = sphToCart(pLat, pLon, elev);

  // Thigh (Outer casing and inner hydraulic)
  lines.push({ p1: pPelvis, p2: pKnee, colorMode: 2, width: 4.0 }); // Outer casing
  // Inner piston detail (rendered at a slight distance)
  lines.push({ 
      p1: sphToCart(pLat, pLon - 0.0002, elev), 
      p2: sphToCart(kneeLat, kneeLon - 0.0002, elev), 
      colorMode: 2, 
      width: 1.0 
  });

  // Calf
  lines.push({ p1: pKnee, p2: pFoot, colorMode: 2, width: 3.0 });
  lines.push({ 
      p1: sphToCart(kneeLat, kneeLon - 0.0002, elev), 
      p2: sphToCart(footLat, footLon - 0.0002, elev), 
      colorMode: 2, 
      width: 1.0 
  });

  // Knee Joint Details
  icons.push({ p: pKnee, char: "[X]", size: 10, type: 'text', meta: { isCyberJoint: true } });
  
  // Robotic Foot Platform
  const pToe = sphToCart(footLat, footLon + 0.0004, elev);
  const pHeel = sphToCart(footLat, footLon - 0.0002, elev);
  lines.push({ p1: pHeel, p2: pToe, colorMode: 2, width: 3.0 });

  return { lines, icons };
}
