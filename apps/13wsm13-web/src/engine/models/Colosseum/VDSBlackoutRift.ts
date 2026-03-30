// ═══════════════════════════════════════════════════════════════════════
// MODEL: VDS BLACKOUT RIFT (Pack 6 / 15)
// Description: A jagged, broken section of the Colosseum floor representing 
// the devastating VDS server crash (ECONNREFUSED).
// Coordinate Space: LAT 0.20, Ground level crack
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getVDSBlackoutRift(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // The Rift is located exactly at the South-East quadrant (Math.PI / 4)
  const crackAngle = Math.PI / 4;
  
  // We draw a jagged canyon in the otherwise perfect sphere grid
  const crackPoints = 12;
  const riftRadius = radius * 0.8;
  
  let prevLeft = null;
  let prevRight = null;
  
  for (let i = 0; i <= crackPoints; i++) {
      const spread = (i / crackPoints) * 0.005; // Crack gets wider away from origin
      const yDist = (i / crackPoints) * 0.02;   // Length of the crack
      
      const jitterL = (Math.random() - 0.5) * 0.002;
      const jitterR = (Math.random() - 0.5) * 0.002;
      
      const pLeft = sphToCart(baseLat + yDist, Math.sin(crackAngle) * riftRadius - spread + jitterL, 0);
      const pRight = sphToCart(baseLat + yDist, Math.sin(crackAngle) * riftRadius + spread + jitterR, 0);
      
      if (prevLeft) lines.push({ p1: prevLeft, p2: pLeft, colorMode: 2, width: 2.5 }); // Red/Glitch color
      if (prevRight) lines.push({ p1: prevRight, p2: pRight, colorMode: 2, width: 2.5 });
      
      // Floating error shards
      icons.push({ p: pLeft, char: "x", size: 8, type: 'rune', meta: { isRiftShard: true, isRed: true } });
      
      prevLeft = pLeft;
      prevRight = pRight;
  }

  // Crash Error Logs
  const logP = sphToCart(baseLat + 0.015, Math.sin(crackAngle) * riftRadius, 15);
  icons.push({ p: logP, char: "FATAL: ECONNREFUSED 127.0.0.1:5432", size: 10, type: 'text', meta: { isRedText: true } });
  icons.push({ p: sphToCart(baseLat + 0.012, Math.sin(crackAngle) * riftRadius, 25), char: "[ VDS OFFLINE : 48H BLACKOUT ]", size: 14, type: 'text', meta: { isGlitchActive: true } });

  return { lines, icons };
}
