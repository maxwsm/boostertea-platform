// ═══════════════════════════════════════════════════════════════════════
// MODEL: ARCHITECTURE - KINETIC (Pack 15 / 4)
// Description: Buildings where parts move mechanically to adapt to the 
// environment. E.g. Al Bahr Towers sun-shields.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getArchKinetic(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const radius = 10;
  const height = 40;
  
  // Base tower cylinder
  lines.push({ p1: {x:-radius, y:0, z:0}, p2: {x:-radius, y:0, z:height}, colorMode: 1, width: 2.0 });
  lines.push({ p1: {x:radius, y:0, z:0}, p2: {x:radius, y:0, z:height}, colorMode: 1, width: 2.0 });

  // Kinetic Sun-shield Panels opening and closing based on time
  const panels = 6;
  for(let z=5; z<height; z+=8){
      for(let i=0; i<panels; i++){
          const a = (i/panels)*TAU;
          
          const pxBase = Math.cos(a)*radius;
          const pyBase = Math.sin(a)*radius;

          // Open/Close mechanic (folding out)
          const fold = (Math.sin(time*2 + z*0.5) + 1) * 0.5; // 0 (closed) to 1 (open)
          const pxTip = Math.cos(a)*(radius + 5*fold);
          const pyTip = Math.sin(a)*(radius + 5*fold);

          // Panel hinges
          const p1: P3D = { x: pxBase, y: pyBase, z };
          const p2: P3D = { x: pxBase, y: pyBase, z: z+6 }; // Top hinge
          const pTip: P3D = { x: pxTip, y: pyTip, z: z+3 }; // Tipping outward

          lines.push({ p1, p2, colorMode: 1, width: 1.0 }); // Frame attached to building
          lines.push({ p1, p2: pTip, colorMode: 3, width: 1.5 }); // Opening shade
          lines.push({ p1: p2, p2: pTip, colorMode: 3, width: 1.5 }); // Opening shade
      }
  }

  icons.push({ p: { x: 0, y: 0, z: height + 15 }, char: "ADAPTIVE KINETICS", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "ARCH_KINETIC", size: 0, type: 'obj', meta: { nlpId: 'arch_kinetic' }});

  return { lines, icons };
}
