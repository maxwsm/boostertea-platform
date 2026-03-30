// ═══════════════════════════════════════════════════════════════════════
// MODEL: GRAPH SCANNER LINE (Pack 7 / 14)
// Description: A vertical laser line that sweeps across the timeline to 
// pinpoint historical metrics continuously.
// Coordinate Space: LAT 0.65
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getGraphScannerLine(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed initially at the start. 
  // It is driven dynamically by the engine state via its meta tag.
  const startLon = -0.05;
  
  const pBottom = sphToCart(baseLat, startLon, elev);
  const pTop = sphToCart(baseLat, startLon, elev + 200);

  // Faint tall laser
  lines.push({ p1: pBottom, p2: pTop, colorMode: 3, width: 0.5 }); // Scanning line

  icons.push({ 
      p: sphToCart(baseLat, startLon, elev), // Pivot anchored to X axis
      char: "SCAN_HEAD", 
      size: 0, 
      type: 'obj', 
      meta: { isTimelineScanner: true, minLon: -0.05, maxLon: 0.04 } 
  });

  return { lines, icons };
}
