// ═══════════════════════════════════════════════════════════════════════
// MODEL 05: THE WEB3 WASTELAND & X-RAY MATRIX
// Description: The desert of dead ICOs and broken dreams.
// Contains a horizontal X-Ray Clipping Plane. Anything below the plane is Solid Rock.
// Anything above the plane is rendered as a blazing Green Hologram of the Future Fort.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

export const WASTE_LAT = 0.35;
export const WASTE_RADIUS = 0.02;

export function generateWastelandScanner(): { lines: PLine[], icons: PIcon[], clippingPlane: number } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  // 1. DEAD RUINS (Broken Geometric Blocks in the Sand)
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * TAU;
    const r = Math.random() * WASTE_RADIUS;
    
    // Low, jagged, broken columns
    const height = 5 + Math.random() * 20; 
    
    const pBase = sphToCart(WASTE_LAT + Math.cos(a)*r, Math.sin(a)*r, 0);
    const pTop = sphToCart(WASTE_LAT + Math.cos(a)*r, Math.sin(a)*r, height);
    
    // Random jagged breaks Instead of a straight line, it bends
    const pMid = sphToCart(WASTE_LAT + Math.cos(a)*r + 0.001, Math.sin(a)*r, height * 0.5);
    
    // colorMode 0 = Dead Stone/Sand (Very low opacity)
    lines.push({ p1: pBase, p2: pMid, colorMode: 0, width: 2.0 });
    lines.push({ p1: pMid, p2: pTop, colorMode: 0, width: 2.0 });
    
    // Ground dust particles
    icons.push({ p: sphToCart(WASTE_LAT + Math.cos(a)*r, Math.sin(a)*r, Math.random() * 2), char: ".", size: 4, type: 'rune' });
  }

  // 2. THE HOLOGRAM FORT (X-Ray Voxel Projections)
  // This geometry sits in the exact same spot but represents the rebuilt future.
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * TAU;
    const r = WASTE_RADIUS * 0.8;
    
    const height = 80 + Math.sin(a * 8) * 40; // High frequency futuristic wall
    
    // In the MasterCanvas render loop, if this vertex's height > Scanner_Y, it will glow green.
    const pBase = sphToCart(WASTE_LAT + Math.cos(a)*r, Math.sin(a)*r, 0);
    const pTop = sphToCart(WASTE_LAT + Math.cos(a)*r, Math.sin(a)*r, height);
    
    // colorMode 3 = X-Ray Web3 Object
    lines.push({ p1: pBase, p2: pTop, colorMode: 3, width: 1.0 });
  }

  // 3. SCANNER TEXTS
  icons.push({ p: sphToCart(WASTE_LAT, 0, 150), char: "> X-RAY PROTOCOL: ENGAGED", size: 18, type: 'text', meta: { isHoloText: true } });
  icons.push({ p: sphToCart(WASTE_LAT + 0.004, 0, 150), char: "PROJECTING: NEURALNOMAD V2", size: 24, type: 'text', meta: { isHoloText: true } });

  // Initial Clipping Plane Y-coordinate (Starts high, moves down recursively based on scroll)
  const clippingPlane = 200; 

  return { lines, icons, clippingPlane };
}
