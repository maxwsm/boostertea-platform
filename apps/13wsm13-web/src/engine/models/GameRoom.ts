// ═══════════════════════════════════════════════════════════════════════
// MODEL 08: THE COLOSSEUM GAME ROOM
// Description: Contains the structural anchor points for the 3 mini-games:
// Node Puzzle, Gas Clicker (Boids), and the Terminal Decryptor.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

export const GAMES_LAT = 0.27; // At the transition edge of the Colosseum

export function generateGameRoom(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  // 1. NODE PUZZLE (Left Side)
  const nodeP1 = sphToCart(GAMES_LAT + 0.005, -0.015, 60); // Master Source
  const nodeP2 = sphToCart(GAMES_LAT + 0.015, -0.025, 40); // BoosterTea Node
  const nodeP3 = sphToCart(GAMES_LAT + 0.02,  -0.01,  30); // FunnyDrops Node

  icons.push({ p: nodeP1, char: "MASTER_MATRIX", size: 16, type: 'text', meta: { isNodeSource: true } });
  icons.push({ p: nodeP2, char: "[ BOOSTER_TEA API ]", size: 12, type: 'text', meta: { isNodeTarget: true, connected: false } });
  icons.push({ p: nodeP3, char: "[ FUNNY_DROPS API ]", size: 12, type: 'text', meta: { isNodeTarget: true, connected: false } });

  // 2. GAS CLICKER (Scattered Fragments / Flocking Boids)
  for (let i = 0; i < 7; i++) {
    const a = Math.random() * TAU;
    const r = Math.random() * 0.01;
    const elev = 80 + Math.random() * 50;
    
    // These start with random positions and velocity vectors
    icons.push({
      p: sphToCart(GAMES_LAT + Math.cos(a)*r, Math.sin(a)*r, elev),
      char: "◆", // Gas Shard
      size: 20,
      type: 'rune',
      meta: {
        isGasShard: true,
        velocity: { x: (Math.random()-0.5)*0.5, y: (Math.random()-0.5)*0.5, z: (Math.random()-0.5)*0.5 },
        evasionRadius: 80, // Flee range
        killed: false
      }
    });
  }

  // 3. THE TERMINAL DECRYPTOR (Right Side)
  // This CRT mesh will have a massive Shader Pass rendered over it in MasterCanvas
  const screenCenter = sphToCart(GAMES_LAT + 0.01, 0.02, 50);
  
  // Terminal physical box outline
  const w = 0.008, h = 0.005, d = 15;
  const pA = sphToCart(GAMES_LAT + 0.01 - h, 0.02 - w, 50 - d);
  const pB = sphToCart(GAMES_LAT + 0.01 - h, 0.02 + w, 50 - d);
  const pC = sphToCart(GAMES_LAT + 0.01 + h, 0.02 + w, 50 + d);
  const pD = sphToCart(GAMES_LAT + 0.01 + h, 0.02 - w, 50 + d);

  lines.push({ p1: pA, p2: pB, colorMode: 1, width: 2.0 });
  lines.push({ p1: pB, p2: pC, colorMode: 1, width: 2.0 });
  lines.push({ p1: pC, p2: pD, colorMode: 1, width: 2.0 });
  lines.push({ p1: pD, p2: pA, colorMode: 1, width: 2.0 });

  icons.push({ 
    p: screenCenter, 
    char: "CRT_BUFFER_RENDER", 
    size: 0, 
    type: 'obj', 
    meta: { isTerminalScreen: true, bufferDecrypted: false } 
  });
  
  icons.push({ p: sphToCart(GAMES_LAT + 0.012, 0.02, 80), char: "[ WAIT FOR WSM_DECRYPT ]", size: 14, type: 'text' });

  return { lines, icons };
}
