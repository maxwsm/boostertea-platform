// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - SADNESS (Pack 12 / 6)
// Description: Reduced neuroactivity. Slow, heavy, low-frequency blue 
// waves representing the depressive state or physical exhaustion.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getNeuroSadness(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Very slow, drooping waves
  const slowTime = time * 0.2;
  const length = 40;
  const segments = 20;
  
  const yOffset = -5;

  for (let wave = 0; wave < 3; wave++) {
      let pPrev: P3D | null = null;
      
      for(let i=0; i<=segments; i++) {
          const x = (i / segments) * length - (length/2);
          
          // Drooping downward curve
          const droop = Math.cos((i/segments)*Math.PI*2 - Math.PI) * 10;
          const z = 20 + droop + Math.sin(x*0.1 - slowTime + wave)*3;
          
          const pCurr: P3D = { x, y: yOffset + wave*5, z };
          
          // Faint, low-energy blue (colorMode 0 or 2 depending on palette, using 0 for dim)
          if(pPrev) lines.push({ p1: pPrev, p2: pCurr, colorMode: 0, width: 2.0 });
          pPrev = pCurr;
      }
  }

  // Teardrop/melancholy sparse nodes
  icons.push({ p: { x: 0, y: 0, z: 15 }, char: "↓", size: 6, type: 'rune', meta: { colorMode: 0 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "NEURO_SADNESS", size: 0, type: 'obj', meta: { nlpId: 'sadness_response' }});

  return { lines, icons };
}
