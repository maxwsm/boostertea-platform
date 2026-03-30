// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - ROUND TABLE (Pack 16 / 2)
// Description: Visualizes absolute equality. No "Head of the table".
// A glowing round table with dozens of equal nodes sitting around it.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getDaoRoundTable(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const radius = 15;
  const height = 10;
  
  // The Table Ring
  for(let i=0; i<36; i++) {
      const a1 = (i/36)*TAU;
      const a2 = ((i+1)/36)*TAU;
      lines.push({ p1: {x:Math.cos(a1)*radius, y:Math.sin(a1)*radius, z:height}, p2: {x:Math.cos(a2)*radius, y:Math.sin(a2)*radius, z:height}, colorMode: 2, width: 2.0 });
  }

  // Participants (No Head)
  const participants = 12;
  for(let i=0; i<participants; i++) {
      const a = (i/participants)*TAU;
      const px = Math.cos(a) * (radius + 5);
      const py = Math.sin(a) * (radius + 5);
      
      const speaking = Math.sin(time*2 + i) > 0.8; // One node lights up periodically

      icons.push({ p: { x: px, y: py, z: height }, char: speaking ? "((+))" : "o", size: speaking ? 8 : 4, type: 'rune', meta: { colorMode: speaking ? 3 : 1 } });
      
      // Connection to the center table logic (The Smart Contract)
      lines.push({ p1: {x:px, y:py, z:height}, p2: {x:0, y:0, z:height}, colorMode: 0, width: speaking ? 1.0 : 0.2 });
  }

  icons.push({ p: { x: 0, y: 0, z: height }, char: "SMART CONTRACT (CEO)", size: 4, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "DAO_TABLE", size: 0, type: 'obj', meta: { nlpId: 'dao_round_table' }});

  return { lines, icons };
}
