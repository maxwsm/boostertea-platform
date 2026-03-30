// ═══════════════════════════════════════════════════════════════════════
// MODEL: BLOCKCHAIN - THE LEDGER (Pack 14 / 5)
// Description: The universal accounting book. Visualizing that all 
// transactions are public, permanent, and accessible to everyone.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getBlockLedger(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const zElev = 10;
  
  // Big open book laying flat
  const widthArea = 30;
  const depthArea = 15;
  
  const pL: P3D = { x: -widthArea/2, y: -depthArea/2, z: zElev };
  const pLT: P3D = { x: -widthArea/2, y: depthArea/2, z: zElev };
  
  const pM: P3D = { x: 0, y: -depthArea/2, z: zElev - 2 }; // Spine dip
  const pMT: P3D = { x: 0, y: depthArea/2, z: zElev - 2 };
  
  const pR: P3D = { x: widthArea/2, y: -depthArea/2, z: zElev };
  const pRT: P3D = { x: widthArea/2, y: depthArea/2, z: zElev };

  // Page planes
  lines.push({ p1: pL, p2: pLT, colorMode: 1, width: 1.0 });
  lines.push({ p1: pLT, p2: pMT, colorMode: 1, width: 1.0 });
  lines.push({ p1: pMT, p2: pM, colorMode: 1, width: 1.0 });
  lines.push({ p1: pM, p2: pL, colorMode: 1, width: 1.0 });

  lines.push({ p1: pM, p2: pMT, colorMode: 1, width: 1.0 });
  lines.push({ p1: pMT, p2: pRT, colorMode: 1, width: 1.0 });
  lines.push({ p1: pRT, p2: pR, colorMode: 1, width: 1.0 });
  lines.push({ p1: pR, p2: pM, colorMode: 1, width: 1.0 });

  // Columns of code/ledgers
  for(let i=0; i<4; i++) {
      const ly = -depthArea/2 + 2 + (i*3);
      icons.push({ p: { x: -7, y: ly, z: zElev }, char: "0xAB... SENT TO 0xCD...", size: 3, type: 'text' });
      icons.push({ p: { x: 7, y: ly, z: zElev }, char: "TX_CONFIRMED", size: 3, type: 'text', meta: { colorMode: 3 } });
  }

  icons.push({ p: { x: 0, y: 0, z: zElev + 15 }, char: "PUBLIC LEDGER", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "BC_LEDGER", size: 0, type: 'obj', meta: { nlpId: 'bc_ledger' }});

  return { lines, icons };
}
