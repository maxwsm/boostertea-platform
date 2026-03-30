// ═══════════════════════════════════════════════════════════════════════
// MODEL: DA VINCI RING (LEFT) (Pack 2 / 1)
// Description: The perfect, smooth biological circle representing the
// organic past of the Vitruvian Man geometry.
// Coordinate Space: LAT 0.06, Radius 0.005
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getDaVinciRingLeft(baseLat: number, radius: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const segments = 60; // Smooth High-Res

  // Left half of the circle
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI + Math.PI / 2; // Left Hemisphere Panning
    const a2 = ((i + 1) / segments) * Math.PI + Math.PI / 2;
    
    const p1 = sphToCart(baseLat + Math.sin(a1) * radius, Math.cos(a1) * radius, elev);
    const p2 = sphToCart(baseLat + Math.sin(a2) * radius, Math.cos(a2) * radius, elev);

    // colorMode 1 = Organic/Biological UI coloring
    lines.push({ p1, p2, colorMode: 1, width: 2.0 });
  }

  // Anchor Runes on left
  icons.push({ p: sphToCart(baseLat, -radius - 0.001, elev), char: "BIO_SYNC_NODE", size: 10, type: 'text' });

  return { lines, icons };
}
