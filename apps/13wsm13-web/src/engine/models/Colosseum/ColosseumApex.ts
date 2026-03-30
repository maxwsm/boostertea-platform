// ═══════════════════════════════════════════════════════════════════════
// MODEL: COLOSSEUM APEX (Pack 15 / 15)
// Description: The crowning architectural antenna and inner energy convergence
// point of the Colosseum. It gathers the visual lines at the top.
// Coordinate Space: LAT 0.20, Elev 120 -> 250
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getColosseumApex(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // The absolute geometric center top of the Colosseum
  const pTopSpire = sphToCart(baseLat, 0, 250);
  const pBaseSpire = sphToCart(baseLat, 0, 120); // Top of the original pillars
  
  // Core Spire
  lines.push({ p1: pBaseSpire, p2: pTopSpire, colorMode: 1, width: 3.0 });

  // Wiring from the outer perimeter (the highest pillars) converging to the Spire
  const connectionPoints = 12;
  for (let i = 0; i < connectionPoints; i++) {
      const angle = (i / connectionPoints) * TAU;
      const pOuter = sphToCart(baseLat + Math.cos(angle) * radius, Math.sin(angle) * radius, 120);
      
      // Wireframe strings pulling inwards to the spire
      lines.push({ p1: pOuter, p2: pTopSpire, colorMode: 0, width: 0.2 });
  }

  // Energy rings pulsing around the spire
  const ringRadiusLat = 0.002;
  const ringElev = 200;
  const segments = 16;
  
  for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * TAU;
      const a2 = ((i + 1) / segments) * TAU;
      
      const p1 = sphToCart(baseLat + Math.cos(a1) * ringRadiusLat, Math.sin(a1) * ringRadiusLat, ringElev);
      const p2 = sphToCart(baseLat + Math.cos(a2) * ringRadiusLat, Math.sin(a2) * ringRadiusLat, ringElev);
      
      lines.push({ p1, p2, colorMode: 3, width: 2.0 }); // Glowing ring color
  }

  // Zenith Matrix Text
  icons.push({ p: pTopSpire, char: "APEX_NODE", size: 0, type: 'obj', meta: { isZenith: true } });
  icons.push({ p: sphToCart(baseLat, 0, 270), char: "[ 13WSM13 CROWN MATRIX ]", size: 14, type: 'text' });

  return { lines, icons };
}
