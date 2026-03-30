// ═══════════════════════════════════════════════════════════════════════
// MODEL: COLOSSEUM FOUNDATION (Pack 1 / 15)
// Description: The massive base ring acting as the structural anchor.
// Coordinate Space: LAT 0.20, Elev 0
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getColosseumFoundation(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const segments = 64; // High resolution base ring

  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * TAU;
    const a2 = ((i + 1) / segments) * TAU;

    const p1 = sphToCart(baseLat + Math.cos(a1) * radius, Math.sin(a1) * radius, 0);
    const p2 = sphToCart(baseLat + Math.cos(a2) * radius, Math.sin(a2) * radius, 0);

    // Inner rim
    const pInner1 = sphToCart(baseLat + Math.cos(a1) * (radius - 0.002), Math.sin(a1) * (radius - 0.002), 0);
    const pInner2 = sphToCart(baseLat + Math.cos(a2) * (radius - 0.002), Math.sin(a2) * (radius - 0.002), 0);

    lines.push({ p1, p2, colorMode: 1, width: 2.0 });
    lines.push({ p1: pInner1, p2: pInner2, colorMode: 1, width: 1.0 });
    lines.push({ p1, p2: pInner1, colorMode: 1, width: 0.5 }); // Connectors
  }

  // Anchor Runes
  icons.push({ p: sphToCart(baseLat + radius + 0.002, 0, 0), char: "FOUNDATION_ANCHOR_X1", size: 10, type: 'text' });
  icons.push({ p: sphToCart(baseLat - radius - 0.002, 0, 0), char: "FOUNDATION_ANCHOR_X2", size: 10, type: 'text' });

  return { lines, icons };
}
