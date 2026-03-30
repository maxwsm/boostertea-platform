// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - CLOSED BOX vs OPEN LEDGER (Pack 13 / 2)
// Description: Grandma Analogy - "Black box vs Glass box".
// Left side: A solid, closed black box. Right side: A transparent, glowing
// matrix box where anyone can see the gears turning inside.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

// Helper to draw a cube
function drawCube(center: P3D, size: number, colorMode: number, lines: PLine[]) {
    const s = size / 2;
    const c = center;
    const p = [
        {x: c.x-s, y: c.y-s, z: c.z-s}, {x: c.x+s, y: c.y-s, z: c.z-s},
        {x: c.x+s, y: c.y+s, z: c.z-s}, {x: c.x-s, y: c.y+s, z: c.z-s},
        {x: c.x-s, y: c.y-s, z: c.z+s}, {x: c.x+s, y: c.y-s, z: c.z+s},
        {x: c.x+s, y: c.y+s, z: c.z+s}, {x: c.x-s, y: c.y+s, z: c.z+s}
    ];

    // Bottom
    lines.push({p1: p[0], p2: p[1], colorMode, width: 2});
    lines.push({p1: p[1], p2: p[2], colorMode, width: 2});
    lines.push({p1: p[2], p2: p[3], colorMode, width: 2});
    lines.push({p1: p[3], p2: p[0], colorMode, width: 2});
    // Top
    lines.push({p1: p[4], p2: p[5], colorMode, width: 2});
    lines.push({p1: p[5], p2: p[6], colorMode, width: 2});
    lines.push({p1: p[6], p2: p[7], colorMode, width: 2});
    lines.push({p1: p[7], p2: p[4], colorMode, width: 2});
    // Pillars
    lines.push({p1: p[0], p2: p[4], colorMode, width: 2});
    lines.push({p1: p[1], p2: p[5], colorMode, width: 2});
    lines.push({p1: p[2], p2: p[6], colorMode, width: 2});
    lines.push({p1: p[3], p2: p[7], colorMode, width: 2});
}

export function getEvolClosedBox(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Web 2: Closed Black Box
  const pWeb2: P3D = { x: -15, y: 0, z: 15 };
  drawCube(pWeb2, 10, 0, lines); // colorMode 0 (dark/hidden)
  icons.push({ p: { x: pWeb2.x, y: 0, z: pWeb2.z + 15 }, char: "SERVER (WEB2)", size: 6, type: 'text' });

  // Web 3: Transparent Glass Box
  const pWeb3: P3D = { x: 15, y: 0, z: 15 };
  drawCube(pWeb3, 10, 3, lines); // colorMode 3 (cyan/glass)
  
  // The 'gears' visible inside the glass box
  const tRing = time * 2;
  const ringR = 3;
  lines.push({ 
      p1: { x: pWeb3.x - Math.cos(tRing)*ringR, y: 0, z: pWeb3.z - Math.sin(tRing)*ringR }, 
      p2: { x: pWeb3.x + Math.cos(tRing)*ringR, y: 0, z: pWeb3.z + Math.sin(tRing)*ringR }, 
      colorMode: 3, width: 2 
  });
  
  icons.push({ p: { x: pWeb3.x, y: 0, z: pWeb3.z + 15 }, char: "OPEN LEDGER (WEB3)", size: 6, type: 'text' });

  // Arrow connecting evolution
  lines.push({ p1: { x: -5, y: 0, z: 15 }, p2: { x: 5, y: 0, z: 15 }, colorMode: 2, width: 2 });
  icons.push({ p: { x: 5, y: 0, z: 15 }, char: ">", size: 6, type: 'rune', meta: { colorMode: 2 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "EVOL_BOX", size: 0, type: 'obj', meta: { nlpId: 'evol_closed_box' }});

  return { lines, icons };
}
