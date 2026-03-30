// ═══════════════════════════════════════════════════════════════════════
// MODEL: RIGHT ARM ROBOTIC (Pack 2 / 7)
// Description: The cybernetic right arm structure. Contains sharp angles,
// piston joints, and strict linear vectors.
// Coordinate Space: LAT 0.06 (Shoulder offset), Cyber color
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getRightArmRobotic(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Shoulder joint (Right)
  const sLat = baseLat - radius * 0.3; // Y offset (up)
  const sLon = radius * 0.15;          // X offset (right)

  // Arm 1: Horizontal (Piston array)
  const pElbow1 = sphToCart(sLat, sLon + radius * 0.4, elev);
  const pHand1 = sphToCart(sLat, sLon + radius * 0.85, elev);

  // Thicker shoulder to elbow
  const pShoulder = sphToCart(sLat, sLon, elev);
  lines.push({ p1: pShoulder, p2: pElbow1, colorMode: 2, width: 3.0 });
  // Thinner elbow to hand
  lines.push({ p1: pElbow1, p2: pHand1, colorMode: 2, width: 1.5 });
  // Joint marker
  icons.push({ p: pElbow1, char: "O", size: 8, type: 'rune', meta: { isCyberJoint: true } });
  
  // Arm 2: Angled Upward (Hydraulic line)
  const pElbow2 = sphToCart(sLat - radius * 0.2, sLon + radius * 0.3, elev);
  const pHand2 = sphToCart(sLat - radius * 0.4, sLon + radius * 0.65, elev);

  lines.push({ p1: pShoulder, p2: pElbow2, colorMode: 2, width: 3.0 });
  lines.push({ p1: pElbow2, p2: pHand2, colorMode: 2, width: 1.5 });
  icons.push({ p: pElbow2, char: "O", size: 8, type: 'rune', meta: { isCyberJoint: true } });

  // Wiring connectors around the joint
  lines.push({ p1: sphToCart(sLat + 0.0002, sLon + radius * 0.2, elev), p2: sphToCart(sLat, sLon + radius * 0.3, elev), colorMode: 2, width: 0.5 });
  lines.push({ p1: sphToCart(sLat - 0.0002, sLon + radius * 0.2, elev), p2: sphToCart(sLat, sLon + radius * 0.3, elev), colorMode: 2, width: 0.5 });

  // Mechanical gripper (Hands)
  icons.push({ p: pHand1, char: "]-", size: 10, type: 'text', meta: { isCyberHand: true } });
  icons.push({ p: pHand2, char: "]-", size: 10, type: 'text', meta: { isCyberHand: true, rotate: -45 } });

  return { lines, icons };
}
