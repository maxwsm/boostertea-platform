// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - THE SCULPTURE OF THE INTERNET (Pack 13 / 7)
// Description: A central monument representing the progression:
// Read (Web1) -> Write (Web2) -> Own (Web3).
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getEvolSculpture(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Base Pedestal
  lines.push({ p1: {x:-10, y:0, z:0}, p2: {x:10, y:0, z:0}, colorMode: 1, width: 3.0 });

  // Web 1: Read-Only (A simple static book or block)
  icons.push({ p: { x: 0, y: 0, z: 10 }, char: "WEB 1: READ", size: 6, type: 'text', meta: { colorMode: 0 } });
  lines.push({ p1: {x:-5, y:0, z:15}, p2: {x:5, y:0, z:15}, colorMode: 0, width: 1.0 }); // Hard flat line

  // Web 2: Read-Write (Interactive but centralized)
  icons.push({ p: { x: 0, y: 0, z: 25 }, char: "WEB 2: WRITE", size: 8, type: 'text', meta: { colorMode: 1 } });
  
  const w2y = Math.sin(time*3)*3; // Moving back and forth (interactive)
  lines.push({ p1: {x:-8, y:w2y, z:30}, p2: {x:8, y:-w2y, z:30}, colorMode: 1, width: 2.0 });

  // Web 3: Read-Write-Own (The Golden Crown)
  icons.push({ p: { x: 0, y: 0, z: 45 }, char: "WEB 3: READ-WRITE-OWN", size: 10, type: 'text', meta: { colorMode: 2 } });
  
  // Rotating diamond of ownership
  const a = time;
  const cx = 0, cz = 55, s = 5;
  const dTop: P3D = { x: cx, y: 0, z: cz + s };
  const dBot: P3D = { x: cx, y: 0, z: cz - s };
  const dLeft: P3D = { x: cx - Math.cos(a)*s, y: -Math.sin(a)*s, z: cz };
  const dRight: P3D = { x: cx + Math.cos(a)*s, y: Math.sin(a)*s, z: cz };

  lines.push({ p1: dTop, p2: dLeft, colorMode: 2, width: 2.0 });
  lines.push({ p1: dTop, p2: dRight, colorMode: 2, width: 2.0 });
  lines.push({ p1: dBot, p2: dLeft, colorMode: 2, width: 2.0 });
  lines.push({ p1: dBot, p2: dRight, colorMode: 2, width: 2.0 });

  icons.push({ p: { x: 0, y: 0, z: -10 }, char: "EVOL_SCULPTURE", size: 0, type: 'obj', meta: { nlpId: 'evol_sculpture' }});

  return { lines, icons };
}
