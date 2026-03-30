// ═══════════════════════════════════════════════════════════════════════
// MODEL: METRIC RING 1 (Pack 11 / 15)
// Description: The inner glowing ring showing RPS (Requests Per Second) and
// real-time edge processing nodes.
// Coordinate Space: LAT 0.20, inner floating circle (Elev 40)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getMetricRing1(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const metricElev = 40;
  const innerRadius = radius * 0.75;
  const segments = 32;

  // The Solid Data Ring
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * TAU;
    const a2 = ((i + 1) / segments) * TAU;

    const p1 = sphToCart(baseLat + Math.cos(a1) * innerRadius, Math.sin(a1) * innerRadius, metricElev);
    const p2 = sphToCart(baseLat + Math.cos(a2) * innerRadius, Math.sin(a2) * innerRadius, metricElev);
    
    // Add pulsing thickness to specific quadrants
    const isPulsing = i % 8 === 0;
    
    if (isPulsing) {
        lines.push({ p1, p2, colorMode: 3, width: 3.0 }); // Green/X-Ray glow
        // Add RPS Data floating above the pulsing sectors
        icons.push({ p: sphToCart(baseLat + Math.cos(a1) * innerRadius, Math.sin(a1) * innerRadius, metricElev + 10), char: "RPS: " + (2000 + Math.floor(Math.random() * 500)), size: 10, type: 'text' });
    } else {
        lines.push({ p1, p2, colorMode: 1, width: 1.0 }); // Standard UI ring
    }
  }

  // Floating progress bars circling the metric ring
  icons.push({ p: sphToCart(baseLat, innerRadius, metricElev - 5), char: "[░░█████████████░░]", size: 10, type: 'text', meta: { orbitAngle: 0, orbitSpeed: 0.01 } });
  icons.push({ p: sphToCart(baseLat, -innerRadius, metricElev - 5), char: "[░░░░░██████████░░]", size: 10, type: 'text', meta: { orbitAngle: Math.PI, orbitSpeed: 0.01 } });

  return { lines, icons };
}
