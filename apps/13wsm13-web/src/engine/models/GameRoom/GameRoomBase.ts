// ═══════════════════════════════════════════════════════════════════════
// MODEL: GAMEROOM BASE (Pack 5 / 1)
// Description: The structural floor for the Arcade/Minigames zone holding 
// the Node Puzzle, Gas Clicker, and CRT Terminal.
// Coordinate Space: LAT 0.27, Elev 20
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getGameRoomBase(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const roomRadius = 0.02;
  const segments = 16;
  
  // Render a wide circular platform containing the games
  for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * TAU;
        const a2 = ((i + 1) / segments) * TAU;

        const p1 = sphToCart(baseLat + Math.cos(a1) * roomRadius, Math.sin(a1) * roomRadius, elev);
        const p2 = sphToCart(baseLat + Math.cos(a2) * roomRadius, Math.sin(a2) * roomRadius, elev);
        
        lines.push({ p1, p2, colorMode: 1, width: 2.0 });

        // Raised lip / guardrail around the arcade
        const pTop1 = sphToCart(baseLat + Math.cos(a1) * roomRadius, Math.sin(a1) * roomRadius, elev + 5);
        const pTop2 = sphToCart(baseLat + Math.cos(a2) * roomRadius, Math.sin(a2) * roomRadius, elev + 5);

        lines.push({ p1: pTop1, p2: pTop2, colorMode: 1, width: 0.5 });
        lines.push({ p1: p1, p2: pTop1, colorMode: 1, width: 1.0 }); // Vertical connectors
  }
  
  icons.push({ p: sphToCart(baseLat, 0, elev), char: "[ THE COLOSSEUM ARCADE ]", size: 16, type: 'text' });

  return { lines, icons };
}
