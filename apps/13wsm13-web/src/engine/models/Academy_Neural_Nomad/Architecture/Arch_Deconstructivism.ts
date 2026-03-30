// ═══════════════════════════════════════════════════════════════════════
// MODEL: ARCHITECTURE - DECONSTRUCTIVISM (Pack 15 / 3)
// Description: Fragmented, unpredictable, non-rectilinear shapes 
// typical of Zaha Hadid or Frank Gehry. 'Stable Chaos'.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

// Helper to draw angled planes (metal sheets)
function drawPlate(p1: P3D, p2: P3D, p3: P3D, lines: PLine[]) {
    lines.push({ p1, p2, colorMode: 3, width: 1.5 });
    lines.push({ p1: p2, p2: p3, colorMode: 3, width: 1.5 });
    lines.push({ p1: p3, p2: p1, colorMode: 3, width: 1.5 });
}

export function getArchDeconstructivism(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // A chaotic cluster of steel plates
  drawPlate({x:-10,y:-5,z:0}, {x:5,y:5,z:25}, {x:15,y:-10,z:10}, lines);
  drawPlate({x:5,y:5,z:25}, {x:-15,y:10,z:40}, {x:-5,y:-15,z:15}, lines);
  drawPlate({x:10,y:10,z:5}, {x:0,y:20,z:35}, {x:-10,y:5,z:20}, lines);
  
  // Gravity defying cantilever structure
  lines.push({ p1: {x:-10,y:-5,z:0}, p2: {x:-25, y:-20, z:50}, colorMode: 1, width: 3.0 });
  lines.push({ p1: {x:15,y:-10,z:10}, p2: {x:-25, y:-20, z:50}, colorMode: 1, width: 1.0 });

  icons.push({ p: { x: 0, y: 0, z: 60 }, char: "CONTROLLED CHAOS", size: 6, type: 'text' });
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "ARCH_DECON", size: 0, type: 'obj', meta: { nlpId: 'arch_deconstructivism' }});

  return { lines, icons };
}
