// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - PYRAMID COLLAPSE (Pack 16 / 7)
// Description: A visual representation of the traditional, hierarchical 
// corporate pyramid crumbling to pieces, being replaced by a flat, 
// decentralized network on the ground.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getDaoPyramidCollapse(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Base polygon
  const baseS = 15;
  const pB1: P3D = { x: -baseS, y: -baseS, z: 0 };
  const pB2: P3D = { x: baseS, y: -baseS, z: 0 };
  const pB3: P3D = { x: baseS, y: baseS, z: 0 };
  const pB4: P3D = { x: -baseS, y: baseS, z: 0 };
  
  // The Apex (CEO/Boss)
  // Time > 0 dictates how much the apex has shattered and fallen down
  const apexFall = Math.max(0, Math.sin(time)*20); 
  const pApex: P3D = { x: 0 + Math.sin(time*2)*2, y: 0, z: 30 - apexFall };

  // Draw the collapsing pyramid lines
  lines.push({ p1: pB1, p2: pB2, colorMode: 1, width: 2.0 });
  lines.push({ p1: pB2, p2: pB3, colorMode: 1, width: 2.0 });
  lines.push({ p1: pB3, p2: pB4, colorMode: 1, width: 2.0 });
  lines.push({ p1: pB4, p2: pB1, colorMode: 1, width: 2.0 });

  lines.push({ p1: pB1, p2: pApex, colorMode: (apexFall > 10) ? 3 : 1, width: 1.0 });
  lines.push({ p1: pB2, p2: pApex, colorMode: (apexFall > 10) ? 3 : 1, width: 1.0 });
  lines.push({ p1: pB3, p2: pApex, colorMode: (apexFall > 10) ? 3 : 1, width: 1.0 });
  lines.push({ p1: pB4, p2: pApex, colorMode: (apexFall > 10) ? 3 : 1, width: 1.0 });

  // Floating text
  icons.push({ p: pApex, char: "CEO_NODE", size: 4, type: 'text', meta: { colorMode: 3 } });

  if(apexFall > 15) {
      icons.push({ p: { x: 0, y: 0, z: 8 }, char: "HIERARCHY DEFEATED", size: 6, type: 'text', meta: { colorMode: 2 } });
  }

  icons.push({ p: { x: 0, y: 0, z: -10 }, char: "DAO_PYRAMID", size: 0, type: 'obj', meta: { nlpId: 'dao_pyramid_collapse' }});

  return { lines, icons };
}
