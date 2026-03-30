// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - INTEREST (Pack 12 / 7)
// Description: Visualizes Noradrenaline/Dopamine flow in a focused state.
// Sharp, rapid flashes converging on a single focal target.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getNeuroInterest(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pTarget: P3D = { x: 0, y: 0, z: 25 }; // Focus of attention
  const rings = 3;
  
  for(let r=1; r<=rings; r++) {
      const radius = r * 10;
      const count = r * 6;
      
      for(let i=0; i<count; i++) {
          const a = (i/count) * TAU + (time * 0.5 * (r%2 ? 1 : -1));
          
          const pOuter: P3D = { x: Math.cos(a)*radius, y: Math.sin(a)*radius, z: 10 };
          
          // Focus beams shooting to the target
          // Using a dashed pattern or fading based on time
          if (Math.sin(time*5 + r + i) > 0) {
              lines.push({ p1: pOuter, p2: pTarget, colorMode: 2, width: 1.0 });
              icons.push({ p: pOuter, char: ">", size: 4, type: 'rune', meta: { colorMode: 2 } });
          }
      }
  }

  icons.push({ p: pTarget, char: "[ TARGET ]", size: 8, type: 'text', meta: { isBlinking: true } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "NEURO_INTEREST", size: 0, type: 'obj', meta: { nlpId: 'interest_focus' }});

  return { lines, icons };
}
