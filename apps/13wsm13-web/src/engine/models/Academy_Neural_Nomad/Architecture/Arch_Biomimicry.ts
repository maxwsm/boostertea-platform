// ═══════════════════════════════════════════════════════════════════════
// MODEL: ARCHITECTURE - BIOMIMICRY (Pack 15 / 2)
// Description: Architecture inspired by nature. Buildings acting like 
// living organisms (e.g. self-cooling termite mounds or breathing trees).
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getArchBiomimicry(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // A skyscraper that looks like a twisting, breathing leaf/vine structure
  const floors = 15;
  const radius = 8;
  const twistSpeed = time * 0.2;
  
  let pPrev1: P3D | null = null;
  let pPrev2: P3D | null = null;
  let pPrev3: P3D | null = null;

  for(let i=0; i<floors; i++) {
        // Building breathing expansion logic
        const breath = Math.sin(time*1.5 + i*0.2) * 1.5;
        const currentRadius = radius - (i*0.3) + breath; // Tapers at top, breathes
        const z = i * 4;
        
        const a1 = twistSpeed + i*0.3;
        const a2 = twistSpeed + i*0.3 + (TAU/3);
        const a3 = twistSpeed + i*0.3 + (2*TAU/3);

        const p1: P3D = { x: Math.cos(a1)*currentRadius, y: Math.sin(a1)*currentRadius, z };
        const p2: P3D = { x: Math.cos(a2)*currentRadius, y: Math.sin(a2)*currentRadius, z };
        const p3: P3D = { x: Math.cos(a3)*currentRadius, y: Math.sin(a3)*currentRadius, z };

        // Floor rings
        lines.push({ p1, p2, colorMode: 2, width: 1.0 }); // Green/Gold nature motif
        lines.push({ p1: p2, p2: p3, colorMode: 2, width: 1.0 });
        lines.push({ p1: p3, p2: p1, colorMode: 2, width: 1.0 });

        // Vertical DNA-like structural columns
        if (pPrev1 && pPrev2 && pPrev3) {
            lines.push({ p1, p2: pPrev1, colorMode: 1, width: 2.0 });
            lines.push({ p1: p2, p2: pPrev2, colorMode: 1, width: 2.0 });
            lines.push({ p1: p3, p2: pPrev3, colorMode: 1, width: 2.0 });
        }

        pPrev1 = p1; pPrev2 = p2; pPrev3 = p3;
  }

  icons.push({ p: { x: 0, y: 0, z: floors*4 + 10 }, char: "LIVING ORGANISM", size: 6, type: 'text', meta: { colorMode: 2 } });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "ARCH_BIO", size: 0, type: 'obj', meta: { nlpId: 'arch_biomimicry' }});

  return { lines, icons };
}
