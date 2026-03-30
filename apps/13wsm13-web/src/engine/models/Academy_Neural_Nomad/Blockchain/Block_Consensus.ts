// ═══════════════════════════════════════════════════════════════════════
// MODEL: BLOCKCHAIN - CONSENSUS PROTOCOL (Pack 14 / 6)
// Description: Visualizes multiple nodes agreeing perfectly on the 
// truth, defeating a malicious rogue node visually.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getBlockConsensus(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const nodes = 5;
  const radius = 15;
  const pCenter: P3D = { x: 0, y: 0, z: 15 };

  icons.push({ p: pCenter, char: "TRUTH", size: 6, type: 'text', meta: { colorMode: 2 } }); // Truth core

  for(let i=0; i<nodes; i++) {
        const a = (i/nodes)*TAU;
        const px = Math.cos(a)*radius;
        const pz = 15 + Math.sin(a)*radius;
        const pNode: P3D = { x: px, y: 0, z: pz };

        // 4 nodes agree, 1 is a rogue hacker
        const isRogue = (i === 2);
        
        icons.push({ p: pNode, char: isRogue ? "X" : "V", size: 6, type: 'rune', meta: { colorMode: isRogue ? 3 : 2 } });

        // Healthy nodes synchronize
        if (!isRogue) {
            lines.push({ p1: pNode, p2: pCenter, colorMode: 2, width: (Math.sin(time*2)+1) }); // Pulsing sync
        } else {
            // Rogue node connection is broken/rejected
            lines.push({ p1: pNode, p2: { x: px*0.5, y: 0, z: pz*0.5 + 7.5 }, colorMode: 3, width: 0.5 });
            icons.push({ p: pNode, char: "REJECTED", size: 4, type: 'text', meta: { colorMode: 3 } });
        }
  }

  icons.push({ p: { x: 0, y: 0, z: 35 }, char: "CONSENSUS ALGORITHM", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "BC_CONSENSUS", size: 0, type: 'obj', meta: { nlpId: 'bc_consensus' }});

  return { lines, icons };
}
