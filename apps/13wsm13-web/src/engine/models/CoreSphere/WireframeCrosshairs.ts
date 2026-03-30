// ═══════════════════════════════════════════════════════════════════════
// MODEL: WIREFRAME CROSSHAIRS (Pack 8 / 9)
// Description: A 3D HUD crosshair locked to the center of the camera's 
// projection space to act as a target lock for interacting with models.
// Coordinate Space: LAT 0, LON 0, Z=High (Always over UI)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, sphToCart } from "../../utils/math";

export function getWireframeCrosshairs(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Because the camera usually looks down from a distance, 
  // placing a small object exactly between camera and 0,0 acts as a Crosshair.
  // In practical rendering, this might be handled by 2D canvas, but doing it in 3D is pure.
  
  const cRadius = 0.002;
  const cZ = 500; // Hovering very high, between camera and ground
  
  const pTop = sphToCart(cRadius, 0, cZ);
  const pBot = sphToCart(-cRadius, 0, cZ);
  const pLeft = sphToCart(0, -cRadius, cZ);
  const pRight = sphToCart(0, cRadius, cZ);

  // Cross lines
  lines.push({ p1: pTop, p2: pBot, colorMode: 1, width: 0.5 });
  lines.push({ p1: pLeft, p2: pRight, colorMode: 1, width: 0.5 });
  
  // Center dot
  icons.push({ p: sphToCart(0, 0, cZ), char: "+", size: 8, type: 'rune', meta: { isCrosshair: true } });

  // Framing corners
  const tick = 0.0005;
  const tL1 = sphToCart(-cRadius, -cRadius, cZ);
  const tL2 = sphToCart(-cRadius + tick, -cRadius, cZ);
  const tL3 = sphToCart(-cRadius, -cRadius + tick, cZ);
  lines.push({ p1: tL1, p2: tL2, colorMode: 1, width: 1.0 });
  lines.push({ p1: tL1, p2: tL3, colorMode: 1, width: 1.0 });

  return { lines, icons };
}
