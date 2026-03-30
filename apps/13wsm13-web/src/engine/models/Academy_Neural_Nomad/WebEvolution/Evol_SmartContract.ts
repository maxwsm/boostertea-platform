// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - PAPER CONTRACT vs SMART CONTRACT (Pack 13 / 4)
// Description: Grandma Analogy - "Trusting a Lawyer vs Trusting Math".
// Left: A slow paper contract with a pen. 
// Right: An automated, glowing terminal executing unconditionally.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getEvolSmartContract(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Left: Paper Contract
  const pPaper: P3D = { x: -15, y: 0, z: 10 };
  
  // Page outline
  lines.push({ p1: { x: pPaper.x - 5, y: 0, z: pPaper.z + 8 }, p2: { x: pPaper.x + 5, y: 0, z: pPaper.z + 8 }, colorMode: 1, width: 1.0 });
  lines.push({ p1: { x: pPaper.x + 5, y: 0, z: pPaper.z + 8 }, p2: { x: pPaper.x + 5, y: 0, z: pPaper.z - 8 }, colorMode: 1, width: 1.0 });
  lines.push({ p1: { x: pPaper.x + 5, y: 0, z: pPaper.z - 8 }, p2: { x: pPaper.x - 5, y: 0, z: pPaper.z - 8 }, colorMode: 1, width: 1.0 });
  lines.push({ p1: { x: pPaper.x - 5, y: 0, z: pPaper.z - 8 }, p2: { x: pPaper.x - 5, y: 0, z: pPaper.z + 8 }, colorMode: 1, width: 1.0 });
  
  icons.push({ p: pPaper, char: "LAWYER/FEE", size: 4, type: 'text' });
  icons.push({ p: { x: pPaper.x, y: 0, z: pPaper.z + 15 }, char: "PAPER CONTRACT (SLOW)", size: 6, type: 'text' });

  // Right: Automated Smart Contract
  const pSmart: P3D = { x: 15, y: 0, z: 10 };
  
  // Hexagon Core (Code Execution)
  for(let i=0; i<6; i++){
      const a1 = (i/6)*Math.PI*2 + time;
      const a2 = ((i+1)/6)*Math.PI*2 + time;
      
      const p1: P3D = { x: pSmart.x + Math.cos(a1)*6, y: 0, z: pSmart.z + Math.sin(a1)*6 };
      const p2: P3D = { x: pSmart.x + Math.cos(a2)*6, y: 0, z: pSmart.z + Math.sin(a2)*6 };
      
      lines.push({ p1, p2, colorMode: 3, width: 2.0 }); // Electric code ring
  }
  
  icons.push({ p: pSmart, char: "{ if(X) do(Y) }", size: 5, type: 'text', meta: { colorMode: 3 } });
  icons.push({ p: { x: pSmart.x, y: 0, z: pSmart.z + 15 }, char: "SMART CONTRACT (INSTANT)", size: 6, type: 'text' });

  // Arrow connecting evolution
  lines.push({ p1: { x: -5, y: 0, z: 10 }, p2: { x: 5, y: 0, z: 10 }, colorMode: 2, width: 2 });
  icons.push({ p: { x: 5, y: 0, z: 10 }, char: ">", size: 6, type: 'rune', meta: { colorMode: 2 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "EVOL_CONTRACT", size: 0, type: 'obj', meta: { nlpId: 'evol_smart_contract' }});

  return { lines, icons };
}
