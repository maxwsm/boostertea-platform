// ═══════════════════════════════════════════════════════════════════════
// MODEL: ARCHITECTURE - GLASS & LIGHT (Pack 15 / 5)
// Description: Extreme minimalism, seamless curved glass. The Apple 
// Campus / Futuristic aesthetic where structural joints are invisible.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getArchGlassLight(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const outerR = 25;
  const innerR = 15;
  const h = 8;
  const segments = 36;

  // The massive seamless ring (Apple Park style)
  let pPrevO_B: P3D | null = null;
  let pPrevO_T: P3D | null = null;
  let pPrevI_B: P3D | null = null;
  let pPrevI_T: P3D | null = null;
  
  let pFirstO_B: P3D | null = null;
  let pFirstO_T: P3D | null = null;
  let pFirstI_B: P3D | null = null;
  let pFirstI_T: P3D | null = null;

  for(let i=0; i<segments; i++){
      const a = (i/segments)*TAU;
      
      const poB: P3D = { x: Math.cos(a)*outerR, y: Math.sin(a)*outerR, z: 0 };
      const poT: P3D = { x: Math.cos(a)*outerR, y: Math.sin(a)*outerR, z: h };
      const piB: P3D = { x: Math.cos(a)*innerR, y: Math.sin(a)*innerR, z: 0 };
      const piT: P3D = { x: Math.cos(a)*innerR, y: Math.sin(a)*innerR, z: h };

      if(pPrevO_B && pPrevO_T && pPrevI_B && pPrevI_T) {
          // Drawing pure horizontal sweeping curves
          lines.push({ p1: pPrevO_B, p2: poB, colorMode: 1, width: 2.0 });
          lines.push({ p1: pPrevO_T, p2: poT, colorMode: 1, width: 2.0 });
          lines.push({ p1: pPrevI_B, p2: piB, colorMode: 1, width: 1.0 });
          lines.push({ p1: pPrevI_T, p2: piT, colorMode: 1, width: 1.0 });
      } else {
          pFirstO_B = poB; pFirstO_T = poT; pFirstI_B = piB; pFirstI_T = piT;
      }
      pPrevO_B = poB; pPrevO_T = poT; pPrevI_B = piB; pPrevI_T = piT;

      // No vertical joints, just pure glass surface reflections
      if (i % 4 === 0) {
          icons.push({ p: { x: Math.cos(a)*(outerR-2), y: Math.sin(a)*(outerR-2), z: h/2 }, char: "/", size: 6, type: 'rune', meta: { colorMode: 2 } });
      }
  }

  // Connect loops
  if (pFirstO_B && pPrevO_B) {
      lines.push({ p1: pPrevO_B, p2: pFirstO_B, colorMode: 1, width: 2.0 });
      lines.push({ p1: pPrevO_T!, p2: pFirstO_T!, colorMode: 1, width: 2.0 });
      lines.push({ p1: pPrevI_B!, p2: pFirstI_B!, colorMode: 1, width: 1.0 });
      lines.push({ p1: pPrevI_T!, p2: pFirstI_T!, colorMode: 1, width: 1.0 });
  }

  icons.push({ p: { x: 0, y: 0, z: h + 15 }, char: "SEAMLESS PANORAMA", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "ARCH_GLASS", size: 0, type: 'obj', meta: { nlpId: 'arch_glass' }});

  return { lines, icons };
}
