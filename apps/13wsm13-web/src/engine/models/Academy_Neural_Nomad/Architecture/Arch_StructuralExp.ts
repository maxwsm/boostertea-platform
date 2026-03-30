// ═══════════════════════════════════════════════════════════════════════
// MODEL: ARCHITECTURE - STRUCTURAL EXPRESSIONISM (Pack 15 / 6)
// Description: 'High-Tech' architecture where the internal structural 
// bones, elevators, and pipes are exposed on the outside (Centre Pompidou).
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getArchStructuralExp(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const width = 20;
  const depth = 10;
  const floors = 5;
  const floorH = 8;
  
  // Core box structure
  for(let f=0; f<=floors; f++){
      const z = f * floorH;
      // Floor lines
      lines.push({ p1: {x:-width/2, y:-depth/2, z}, p2: {x:width/2, y:-depth/2, z}, colorMode: 1, width: 1.0 });
      lines.push({ p1: {x:-width/2, y:depth/2, z}, p2: {x:width/2, y:depth/2, z}, colorMode: 1, width: 1.0 });
      lines.push({ p1: {x:-width/2, y:-depth/2, z}, p2: {x:-width/2, y:depth/2, z}, colorMode: 1, width: 1.0 });
      lines.push({ p1: {x:width/2, y:-depth/2, z}, p2: {x:width/2, y:depth/2, z}, colorMode: 1, width: 1.0 });
  }

  // Exposed structural X-bracing on the front facade
  for(let f=0; f<floors; f++){
      const z = f * floorH;
      lines.push({ p1: {x:-width/2, y:-depth/2, z}, p2: {x:0, y:-depth/2, z: z+floorH}, colorMode: 2, width: 2.0 });
      lines.push({ p1: {x:0, y:-depth/2, z}, p2: {x:-width/2, y:-depth/2, z: z+floorH}, colorMode: 2, width: 2.0 });
      
      lines.push({ p1: {x:0, y:-depth/2, z}, p2: {x:width/2, y:-depth/2, z: z+floorH}, colorMode: 2, width: 2.0 });
      lines.push({ p1: {x:width/2, y:-depth/2, z}, p2: {x:0, y:-depth/2, z: z+floorH}, colorMode: 2, width: 2.0 });
  }

  // Exposed massive ventilation pipes on the side
  const pipeX = width/2 + 2;
  lines.push({ p1: {x:pipeX, y:0, z:0}, p2: {x:pipeX, y:0, z:floors*floorH + 5}, colorMode: 3, width: 4.0 });
  lines.push({ p1: {x:pipeX, y:0, z:floors*floorH + 5}, p2: {x:pipeX-5, y:0, z:floors*floorH + 5}, colorMode: 3, width: 4.0 });

  icons.push({ p: { x: 0, y: 0, z: floors*floorH + 20 }, char: "MACHINE AESTHETIC", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "ARCH_EXPRESSION", size: 0, type: 'obj', meta: { nlpId: 'arch_structural' }});

  return { lines, icons };
}
