// ═══════════════════════════════════════════════════════════════════════
// MODEL: CORE PULSE NODE (Pack 8 / 7)
// Description: The absolute mathematical center of the entire ecosystem.
// Evaluates at exactly (0,0,0) and drives the heartbeat shader.
// Coordinate Space: LAT 0, LON 0, ELEV 0
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getCorePulseNode(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // THE ABSOLUTE CENTER
  const pCenter = sphToCart(0, 0, 0);

  // A tiny perfect octahedron at the center
  const scale = 0.0005;
  const pTop = sphToCart(0, 0, scale*1000);
  const pBot = sphToCart(0, 0, -scale*1000);
  const pFL = sphToCart(-scale, -scale, 0);
  const pFR = sphToCart(-scale, scale, 0);
  const pBL = sphToCart(scale, -scale, 0);
  const pBR = sphToCart(scale, scale, 0);

  // Top pyramid
  lines.push({ p1: pTop, p2: pFL, colorMode: 3, width: 2.0 });
  lines.push({ p1: pTop, p2: pFR, colorMode: 3, width: 2.0 });
  lines.push({ p1: pTop, p2: pBL, colorMode: 3, width: 2.0 });
  lines.push({ p1: pTop, p2: pBR, colorMode: 3, width: 2.0 });

  // Bottom pyramid
  lines.push({ p1: pBot, p2: pFL, colorMode: 3, width: 2.0 });
  lines.push({ p1: pBot, p2: pFR, colorMode: 3, width: 2.0 });
  lines.push({ p1: pBot, p2: pBL, colorMode: 3, width: 2.0 });
  lines.push({ p1: pBot, p2: pBR, colorMode: 3, width: 2.0 });

  icons.push({ 
      p: pCenter, 
      char: "SINGULARITY", 
      size: 16, 
      type: 'text', 
      meta: { isSingularity: true, pulseRate: 1.0 } 
  });

  return { lines, icons };
}
