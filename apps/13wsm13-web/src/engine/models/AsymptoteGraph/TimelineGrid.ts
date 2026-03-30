// ═══════════════════════════════════════════════════════════════════════
// MODEL: TIMELINE GRID (Pack 7 / 15)
// Description: The rigid architectural background grid for the chart.
// Enhances the sterile, brutalist aesthetic.
// Coordinate Space: LAT 0.65, Pushed back slightly (+LAT offset)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getTimelineGrid(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Push the grid slightly further back so it doesn't intersect math lines
  const gridLat = baseLat + 0.005; 
  
  const minLon = -0.05;
  const maxLon = 0.05;
  const maxElev = 180;

  const cols = 15;
  const rows = 10;

  // Vertical Lines
  for (let c = 0; c <= cols; c++) {
      const lon = minLon + (c / cols) * (maxLon - minLon);
      const p1 = sphToCart(gridLat, lon, elev);
      const p2 = sphToCart(gridLat, lon, elev + maxElev);
      lines.push({ p1, p2, colorMode: 0, width: 0.1 }); // Very faint
  }

  // Horizontal Lines
  for (let r = 0; r <= rows; r++) {
      const z = elev + (r / rows) * maxElev;
      const p1 = sphToCart(gridLat, minLon, z);
      const p2 = sphToCart(gridLat, maxLon, z);
      lines.push({ p1, p2, colorMode: 0, width: 0.1 }); // Very faint
  }

  return { lines, icons };
}
