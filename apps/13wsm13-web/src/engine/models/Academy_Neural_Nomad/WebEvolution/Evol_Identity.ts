// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - IDENTITY & DATA (Pack 13 / 6)
// Description: Grandma Analogy - "Medical Record vs Secret Wallet".
// Left: A towering stack of papers with an eye looking at them (Surveillance).
// Right: A shield emitting a single anonymous proof (Zero-Knowledge).
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getEvolIdentity(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Left: Web2 Data Collection (The Tower of Papers)
  const pWeb2: P3D = { x: -15, y: 0, z: 0 };
  for(let i=0; i<5; i++) {
      const h = i * 4;
      const w = 5 - (i*0.5); // Stacking slightly narrower
      lines.push({ p1: { x: pWeb2.x-w, y: 0, z: pWeb2.z+h }, p2: { x: pWeb2.x+w, y: 0, z: pWeb2.z+h }, colorMode: 1, width: 1.0 });
  }
  // The all-seeing Eye (Surveillance Capitalism)
  icons.push({ p: { x: pWeb2.x, y: 0, z: pWeb2.z + 25 }, char: "O", size: 10, type: 'rune', meta: { colorMode: 3 } });
  icons.push({ p: { x: pWeb2.x, y: 0, z: pWeb2.z + 32 }, char: "DATA HARVEST CORP", size: 4, type: 'text' });
  icons.push({ p: { x: pWeb2.x, y: 0, z: pWeb2.z - 10 }, char: "THEY TRACK YOU (WEB2)", size: 6, type: 'text' });

  // Right: Web3 Identity (The Cryptographic Shield)
  const pWeb3: P3D = { x: 15, y: 0, z: 15 };
  
  // Shield shape
  lines.push({ p1: { x: pWeb3.x - 5, y: 0, z: pWeb3.z + 5 }, p2: { x: pWeb3.x + 5, y: 0, z: pWeb3.z + 5 }, colorMode: 2, width: 2.0 });
  lines.push({ p1: { x: pWeb3.x - 5, y: 0, z: pWeb3.z + 5 }, p2: { x: pWeb3.x, y: 0, z: pWeb3.z - 8 }, colorMode: 2, width: 2.0 });
  lines.push({ p1: { x: pWeb3.x + 5, y: 0, z: pWeb3.z + 5 }, p2: { x: pWeb3.x, y: 0, z: pWeb3.z - 8 }, colorMode: 2, width: 2.0 });

  // Anonymous user
  icons.push({ p: { x: pWeb3.x, y: 0, z: pWeb3.z + 2 }, char: "0x...", size: 6, type: 'text', meta: { colorMode: 2 } });
  icons.push({ p: { x: pWeb3.x, y: 0, z: pWeb3.z - 20 }, char: "ZERO KNOWLEDGE (WEB3)", size: 6, type: 'text' });

  // Arrow connecting evolution
  lines.push({ p1: { x: -5, y: 0, z: 10 }, p2: { x: 5, y: 0, z: 10 }, colorMode: 2, width: 2 });
  icons.push({ p: { x: 5, y: 0, z: 10 }, char: ">", size: 6, type: 'rune', meta: { colorMode: 2 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "EVOL_IDENTITY", size: 0, type: 'obj', meta: { nlpId: 'evol_identity' }});

  return { lines, icons };
}
