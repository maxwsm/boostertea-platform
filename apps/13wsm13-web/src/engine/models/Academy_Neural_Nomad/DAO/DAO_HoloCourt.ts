// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - HOLOGRAPHIC COURT (Pack 16 / 8)
// Description: Visualizes Decentralized Dispute Resolution (like Kleros).
// Anonymous jurors around the world resolving a conflict mathematically.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getDaoHoloCourt(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const cz = 15;
  
  // The Dispute Core (Scales of Justice abstraction)
  lines.push({ p1: {x:-10, y:0, z:cz+5}, p2: {x:10, y:0, z:cz+5}, colorMode: 1, width: 2.0 }); // Beam
  lines.push({ p1: {x:0, y:0, z:cz+15}, p2: {x:0, y:0, z:cz-5}, colorMode: 1, width: 2.0 }); // Pillar

  // Left and Right dispute plates
  const balance = Math.sin(time) * 5; // Scales tipping
  lines.push({ p1: {x:-10, y:0, z:cz+5}, p2: {x:-10, y:0, z:cz-5 - balance}, colorMode: 1, width: 1.0 });
  lines.push({ p1: {x:10, y:0, z:cz+5}, p2: {x:10, y:0, z:cz-5 + balance}, colorMode: 1, width: 1.0 });

  lines.push({ p1: {x:-13, y:0, z:cz-5 - balance}, p2: {x:-7, y:0, z:cz-5 - balance}, colorMode: 1, width: 2.0 });
  lines.push({ p1: {x:7, y:0, z:cz-5 + balance}, p2: {x:13, y:0, z:cz-5 + balance}, colorMode: 1, width: 2.0 });

  // Anonymous Holographic Jurors appearing in a ring around the scales
  const jurors = 7;
  const jR = 25;
  for(let i=0; i<jurors; i++) {
        const a = (i/jurors)*TAU + time*0.2;
        const px = Math.cos(a)*jR;
        const py = Math.sin(a)*jR;
        
        icons.push({ p: {x:px, y:py, z:cz}, char: "JUROR_0x", size: 4, type: 'text', meta: { colorMode: 3 } });
        // Voting lasers aimed at the center
        lines.push({ p1: {x:px, y:py, z:cz}, p2: {x:0, y:0, z:cz+5}, colorMode: 3, width: 0.5 });
  }

  icons.push({ p: { x: 0, y: 0, z: cz + 25 }, char: "DECENTRALIZED ARBITRATION", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "DAO_COURT", size: 0, type: 'obj', meta: { nlpId: 'dao_holo_court' }});

  return { lines, icons };
}
