// ═══════════════════════════════════════════════════════════════════════
// MODEL 07: THE LEGO GRAVITY REBUILD (Finale)
// Description: The 13 monumental blocks of the Fort hanging in zero-G.
// They have extreme random starting positions (Chaos) but precise 
// Target positions (Order). Magnetic pull math will lock them in place.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

export const FINALE_LAT = 0.45;
export const FINAL_RADIUS = 0.018;

export function generateLegoRebuild(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  // We are rebuilding the Fort. It consists of 13 main structural pillars/blocks.
  // We'll define their perfect end states (Target) and their chaotic starting states.
  
  for (let i = 0; i < 13; i++) {
    const angle = (i / 13) * TAU;
    
    // The Ideal Ordered Geometry (Target State)
    const tBaseLat = FINALE_LAT + Math.cos(angle) * FINAL_RADIUS;
    const tBaseLon = Math.sin(angle) * FINAL_RADIUS;
    const tTopElev = 80 + Math.sin(angle * 5) * 20;

    const targetBase = sphToCart(tBaseLat, tBaseLon, 0);
    const targetTop = sphToCart(tBaseLat, tBaseLon, tTopElev);

    // The Chaotic Zero-G Geometry (Start State)
    // Random orbit far above or far away from the center
    const chaosLat = tBaseLat + (Math.random() - 0.5) * 0.05;
    const chaosLon = tBaseLon + (Math.random() - 0.5) * 0.05;
    const chaosElev = Math.random() * 400 + 100; 

    // Random rotation for chaos state (using offset top vs base)
    const rotOffsetX = (Math.random() - 0.5) * 0.01;
    const rotOffsetY = (Math.random() - 0.5) * 0.01;

    const chaosBase = sphToCart(chaosLat, chaosLon, chaosElev);
    const chaosTop = sphToCart(chaosLat + rotOffsetX, chaosLon + rotOffsetY, chaosElev + tTopElev);

    // Mass determines how slow the block flies toward the target when user holds LMB.
    const mass = 1000 + Math.random() * 5000;

    // We don't push PLine directly, because PLine doesn't support massive metadata easy.
    // Instead we push Icons of type 'obj' that act as "LegoBlocks" rendering directives.
    icons.push({
      p: chaosBase,
      char: "LEGO_PILLAR",
      size: 0,
      type: 'obj',
      meta: {
        isLegoBlock: true,
        mass: mass,
        chaosState: { p1: chaosBase, p2: chaosTop },
        targetState: { p1: targetBase, p2: targetTop },
        currentVelocity: { x: 0, y: 0, z: 0 },
        isSnapped: false, // Will become true when Distance < 2.0
      }
    });
  }

  // The Helicopter (Spline Tracker)
  icons.push({ p: sphToCart(FINALE_LAT, 0, 0), char: "HELICOPTER_RIG", size: 0, type: 'obj', meta: { isHeli: true, t: 0 } });

  // THE GLOBAL MANIFESTO (Hidden until 13/13 blocks are snapped)
  icons.push({ p: sphToCart(FINALE_LAT, 0, 150), char: "13WSM13 — GAME CHANGER CREATOR", size: 40, type: 'text', meta: { isFinaleText: true } });

  return { lines, icons };
}
