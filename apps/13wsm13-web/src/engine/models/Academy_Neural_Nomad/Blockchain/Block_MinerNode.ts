// ═══════════════════════════════════════════════════════════════════════
// MODEL: BLOCKCHAIN - MINER NODE (Pack 14 / 3)
// Description: Visualizes a validator/miner rapidly crunching math 
// to seal the next block. "Mining" explained simply.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getBlockMinerNode(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pCore: P3D = { x: 0, y: 0, z: 15 };

  // Core server stack (3 vertical glowing plates)
  for(let i=0; i<3; i++) {
      const zOffset = (i-1)*5;
      lines.push({ p1: {x:-6, y:-4, z:pCore.z+zOffset}, p2: {x:6, y:-4, z:pCore.z+zOffset}, colorMode: 1, width: 3.0 });
      lines.push({ p1: {x:6, y:-4, z:pCore.z+zOffset}, p2: {x:6, y:4, z:pCore.z+zOffset}, colorMode: 1, width: 3.0 });
      lines.push({ p1: {x:6, y:4, z:pCore.z+zOffset}, p2: {x:-6, y:4, z:pCore.z+zOffset}, colorMode: 1, width: 3.0 });
      lines.push({ p1: {x:-6, y:4, z:pCore.z+zOffset}, p2: {x:-6, y:-4, z:pCore.z+zOffset}, colorMode: 1, width: 3.0 });
  }

  // Floating Math algorithms (Proof of Work/Stake)
  const mathRings = 4;
  for(let j=0; j<mathRings; j++) {
      const a = (time * 5) + (j * Math.PI/2);
      const px = Math.cos(a)*15;
      const py = Math.sin(a)*15;
      
      icons.push({ p: { x: px, y: py, z: pCore.z }, char: "1001", size: 4, type: 'rune', meta: { colorMode: 3, isBlinking: true } });
      lines.push({ p1: pCore, p2: { x: px, y: py, z: pCore.z }, colorMode: 3, width: 0.5 }); // Crunching connection
  }

  icons.push({ p: { x: 0, y: 0, z: pCore.z + 15 }, char: "VALIDATOR NODE", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "BC_MINER", size: 0, type: 'obj', meta: { nlpId: 'bc_miner' }});

  return { lines, icons };
}
