// ═══════════════════════════════════════════════════════════════════════
// MODEL: EVOLUTION - DECENTRALIZED WEB (Pack 13 / 8)
// Description: Grandma Analogy - "A Spider's Web".
// If you cut one string of a spider web, the web holds. If you destroy
// a central building (Web2), the whole physical company stops working.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getEvolWeb(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const nodes: P3D[] = [];
  const numNodes = 12;
  const radius = 20;

  // Generate outer nodes
  for (let i = 0; i < numNodes; i++) {
        const a = (i / numNodes) * TAU + Math.sin(time*0.5 + i)*0.1; // Gentle sway
        nodes.push({ x: Math.cos(a)*radius, y: Math.sin(a)*radius, z: 20 });
        
        icons.push({ p: nodes[i], char: "NODE", size: 4, type: 'text', meta: { colorMode: 1 } });
  }

  // Connect them like a spider web (each node connects to its neighbor and one across)
  for (let i = 0; i < numNodes; i++) {
      const pCurrent = nodes[i];
      const pNext = nodes[(i + 1) % numNodes];
      const pCross = nodes[(i + 4) % numNodes]; // Connect across

      lines.push({ p1: pCurrent, p2: pNext, colorMode: 2, width: 1.0 });
      if (i % 2 === 0) {
          lines.push({ p1: pCurrent, p2: pCross, colorMode: 3, width: 0.5 }); // Synaptic connections
      }
  }

  icons.push({ p: { x: 0, y: 0, z: 45 }, char: "NO SINGLE POINT OF FAILURE", size: 8, type: 'text', meta: { isBlinking: true } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "EVOL_WEB", size: 0, type: 'obj', meta: { nlpId: 'evol_decentralized_web' }});

  return { lines, icons };
}
