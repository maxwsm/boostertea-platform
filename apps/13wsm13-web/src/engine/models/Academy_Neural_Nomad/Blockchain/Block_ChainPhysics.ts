// ═══════════════════════════════════════════════════════════════════════
// MODEL: BLOCKCHAIN - CHAIN PHYSICS (Pack 14 / 2)
// Description: Visual representation of cryptographic blocks tied 
// together by glowing, unbreakable hash chains.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

// Helper cube
function drawCube(cx: number, cy: number, cz: number, size: number, lines: PLine[]) {
    const s = size/2;
    const p = [
        {x:cx-s, y:cy-s, z:cz-s}, {x:cx+s, y:cy-s, z:cz-s}, {x:cx+s, y:cy+s, z:cz-s}, {x:cx-s, y:cy+s, z:cz-s},
        {x:cx-s, y:cy-s, z:cz+s}, {x:cx+s, y:cy-s, z:cz+s}, {x:cx+s, y:cy+s, z:cz+s}, {x:cx-s, y:cy+s, z:cz+s}
    ];
    // Bottom
    lines.push({p1:p[0], p2:p[1], colorMode:1, width:2}); lines.push({p1:p[1], p2:p[2], colorMode:1, width:2});
    lines.push({p1:p[2], p2:p[3], colorMode:1, width:2}); lines.push({p1:p[3], p2:p[0], colorMode:1, width:2});
    // Top
    lines.push({p1:p[4], p2:p[5], colorMode:1, width:2}); lines.push({p1:p[5], p2:p[6], colorMode:1, width:2});
    lines.push({p1:p[6], p2:p[7], colorMode:1, width:2}); lines.push({p1:p[7], p2:p[4], colorMode:1, width:2});
    // Sides
    lines.push({p1:p[0], p2:p[4], colorMode:1, width:2}); lines.push({p1:p[1], p2:p[5], colorMode:1, width:2});
    lines.push({p1:p[2], p2:p[6], colorMode:1, width:2}); lines.push({p1:p[3], p2:p[7], colorMode:1, width:2});
}

export function getBlockChainPhysics(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const numBlocks = 3;
  const spacing = 15;
  const offset = -((numBlocks-1)*spacing) / 2;

  let prevBlockP: P3D | null = null;

  for(let i=0; i<numBlocks; i++) {
        const cx = offset + i * spacing;
        const cz = 10;
        
        drawCube(cx, 0, cz, 8, lines);

        icons.push({ p: { x: cx, y: 0, z: cz }, char: `GEN_${i}`, size: 4, type: 'text', meta: { colorMode: 3 } });
        icons.push({ p: { x: cx, y: 0, z: cz - 10 }, char: `HASH: 0x${Math.floor(Math.random()*1000)}..`, size: 4, type: 'text' });

        const currP: P3D = { x: cx, y: 0, z: cz };
        
        if (prevBlockP) {
            // Unbreakable glowing cryptographic chain link
            lines.push({ p1: prevBlockP, p2: currP, colorMode: 2, width: 4.0 });
        }
        prevBlockP = currP;
  }

  icons.push({ p: { x: 0, y: 0, z: 25 }, char: "CRYPTOGRAPHIC PROOF", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "BC_CHAIN", size: 0, type: 'obj', meta: { nlpId: 'bc_chain' }});

  return { lines, icons };
}
