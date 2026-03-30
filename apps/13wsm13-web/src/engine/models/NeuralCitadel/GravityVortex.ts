// ═══════════════════════════════════════════════════════════════════════
// MODEL: GRAVITY VORTEX (Pack 4 / 13)
// Description: The central magnetic point that pulls the Lego Blocks 
// out of chaos and into order when the user triggers the logic.
// Coordinate Space: LAT 0.38, Center Elev (50)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getGravityVortex(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const vRadius = 0.004;
  const segments = 16;

  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        // An orbiting ring simulating a gravity well
        const p1 = sphToCart(baseLat + Math.cos(a1) * vRadius, Math.sin(a1) * vRadius, elev);
        const p2 = sphToCart(baseLat + Math.cos(a2) * vRadius, Math.sin(a2) * vRadius, elev);
        
        lines.push({ p1, p2, colorMode: 2, width: 2.0 });

        // Force-lines pulling towards the center
        lines.push({ p1, p2: sphToCart(baseLat, 0, elev), colorMode: 2, width: 0.5 });
  }

  // The Interaction prompt
  icons.push({ p: sphToCart(baseLat, 0, elev + 10), char: "[ HOLD LEFT CLICK TO REBUILD ]", size: 14, type: 'text', meta: { isGravityTriggerText: true } });
  
  // The mathematical object for the gravity logic
  icons.push({ 
      p: sphToCart(baseLat, 0, elev), 
      char: "GRAVITY_WELL", 
      size: 0, 
      type: 'obj', 
      meta: { isGravityWell: true, pullForce: 0.008 } 
  });

  return { lines, icons };
}
