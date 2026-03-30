// ═══════════════════════════════════════════════════════════════════════
// MODEL: TURBOREPO OBELISK (Pack 4 / 15)
// Description: The monumental obelisk of the Master Architect. Contains the 
// history of the 1.4M lines monolith and the 40K line destruction.
// Coordinate Space: LAT 0.20, Fixed Angle Pivot
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getTurborepoObelisk(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Pivot placement: Slightly to the left inside the Colosseum
  const angle = Math.PI * 1.2;
  const r = radius * 0.7; // Closer to center
  
  const oLat = baseLat + Math.cos(angle) * r;
  const oLon = Math.sin(angle) * r;

  // Render a massive solid triangle/obelisk
  const pBase1 = sphToCart(oLat - 0.002, oLon - 0.002, 0);
  const pBase2 = sphToCart(oLat + 0.002, oLon - 0.002, 0);
  const pBase3 = sphToCart(oLat, oLon + 0.002, 0);
  
  const height = 180;
  const pTop = sphToCart(oLat, oLon, height);

  lines.push({ p1: pBase1, p2: pBase2, colorMode: 1, width: 2.0 });
  lines.push({ p1: pBase2, p2: pBase3, colorMode: 1, width: 2.0 });
  lines.push({ p1: pBase3, p2: pBase1, colorMode: 1, width: 2.0 });

  lines.push({ p1: pBase1, p2: pTop, colorMode: 1, width: 2.0 });
  lines.push({ p1: pBase2, p2: pTop, colorMode: 1, width: 2.0 });
  lines.push({ p1: pBase3, p2: pTop, colorMode: 1, width: 2.0 });

  // Engraved data around the obelisk
  icons.push({ p: sphToCart(oLat, oLon + 0.003, 100), char: ">1.4M LINES (TURBOREPO 2.0)", size: 14, type: 'text' });
  icons.push({ p: sphToCart(oLat, oLon + 0.004, 75), char: "SACRIFICE: -40,000 LEGACY_LINES", size: 12, type: 'text' });
  icons.push({ p: pTop, char: "O(log n)", size: 24, type: 'text' });

  return { lines, icons };
}
