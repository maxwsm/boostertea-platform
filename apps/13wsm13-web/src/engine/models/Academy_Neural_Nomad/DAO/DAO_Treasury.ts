// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - TRANSPARENT TREASURY (Pack 16 / 4)
// Description: A glass bank safe (wireframe). Anyone in the world can 
// verify exactly how much money the organization has at any second.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

// Glass Cube helper
function drawGlassSafe(c: P3D, s: number, lines: PLine[]) {
    const p = [
        {x:c.x-s,y:c.y-s,z:c.z-s}, {x:c.x+s,y:c.y-s,z:c.z-s}, {x:c.x+s,y:c.y+s,z:c.z-s}, {x:c.x-s,y:c.y+s,z:c.z-s},
        {x:c.x-s,y:c.y-s,z:c.z+s}, {x:c.x+s,y:c.y-s,z:c.z+s}, {x:c.x+s,y:c.y+s,z:c.z+s}, {x:c.x-s,y:c.y+s,z:c.z+s}
    ];
    const t = 1.0; // Thin glass line
    lines.push({p1:p[0],p2:p[1],colorMode:1,width:t}); lines.push({p1:p[1],p2:p[2],colorMode:1,width:t});
    lines.push({p1:p[2],p2:p[3],colorMode:1,width:t}); lines.push({p1:p[3],p2:p[0],colorMode:1,width:t});
    lines.push({p1:p[4],p2:p[5],colorMode:1,width:t}); lines.push({p1:p[5],p2:p[6],colorMode:1,width:t});
    lines.push({p1:p[6],p2:p[7],colorMode:1,width:t}); lines.push({p1:p[7],p2:p[4],colorMode:1,width:t});
    lines.push({p1:p[0],p2:p[4],colorMode:1,width:t}); lines.push({p1:p[1],p2:p[5],colorMode:1,width:t});
    lines.push({p1:p[2],p2:p[6],colorMode:1,width:t}); lines.push({p1:p[3],p2:p[7],colorMode:1,width:t});
}

export function getDaoTreasury(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pSafe: P3D = { x: 0, y: 0, z: 15 };
  
  // The wireframe glass safe
  drawGlassSafe(pSafe, 8, lines);

  // The assets inside are perfectly visible from any angle
  icons.push({ p: { x: pSafe.x, y: pSafe.y, z: pSafe.z + 2 }, char: "USDT: 14M", size: 3, type: 'text', meta: { colorMode: 2 } });
  icons.push({ p: { x: pSafe.x, y: pSafe.y, z: pSafe.z - 2 }, char: "ETH: 45K", size: 3, type: 'text', meta: { colorMode: 2 } });

  // Prying eyes around the glass box proving auditability
  icons.push({ p: { x: pSafe.x+15, y: pSafe.y, z: pSafe.z }, char: "AUDITOR", size: 4, type: 'text' });
  lines.push({ p1: { x: pSafe.x+12, y: pSafe.y, z: pSafe.z }, p2: { x: pSafe.x+8, y: pSafe.y, z: pSafe.z }, colorMode: 3, width: 0.5 }); // Looking in

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "DAO_TREASURY", size: 0, type: 'obj', meta: { nlpId: 'dao_treasury' }});

  return { lines, icons };
}
