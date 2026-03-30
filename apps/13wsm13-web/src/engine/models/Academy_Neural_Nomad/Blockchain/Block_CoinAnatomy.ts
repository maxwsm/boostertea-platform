// ═══════════════════════════════════════════════════════════════════════
// MODEL: BLOCKCHAIN - COIN ANATOMY (Pack 14 / 4)
// Description: Exploring what a 'Coin' actually is. Not a physical metal,
// but a container of ledger history and mathematical scarcity.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getBlockCoinAnatomy(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const cz = 15;
  const radius = 10;
  
  // Outer Coin Shell (Rotating)
  let pPrev: P3D | null = null;
  let pFirst: P3D | null = null;
  
  for(let i=0; i<36; i++) {
        const a = (i/36) * TAU;
        // Tilted and rotating coin
        const tilt = Math.PI/6; // 30 degrees tilt
        
        // Transform
        const px = Math.cos(a)*radius;
        const pyRot = Math.sin(a)*radius * Math.cos(tilt);
        const pzRot = Math.sin(a)*radius * Math.sin(tilt);
        
        // Add spin over time
        const cx = px * Math.cos(time) - pzRot * Math.sin(time);
        const cy = pyRot;
        const pzLocal = px * Math.sin(time) + pzRot * Math.cos(time);

        const pCurr: P3D = { x: cx, y: cy, z: cz + pzLocal };

        if (pPrev) lines.push({ p1: pPrev, p2: pCurr, colorMode: 2, width: 2.0 }); // Golden rims
        else pFirst = pCurr;
        pPrev = pCurr;
  }
  if (pFirst && pPrev) lines.push({ p1: pPrev, p2: pFirst, colorMode: 2, width: 2.0 });

  // Core Ledger Energy
  icons.push({ p: { x: 0, y: 0, z: cz }, char: "Ξ", size: 14, type: 'rune', meta: { colorMode: 2 } });
  
  icons.push({ p: { x: 0, y: 0, z: cz + 20 }, char: "CRYPTOGRAPHIC ASSET", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "BC_COIN", size: 0, type: 'obj', meta: { nlpId: 'bc_coin' }});

  return { lines, icons };
}
