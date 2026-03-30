// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - SWARM CONTROL (Pack 16 / 6)
// Description: Visualizes Swarm Intelligence. A flock of independent 
// particles that self-organize into complex, intelligent structures
// without a central brain commanding them.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getDaoSwarmControl(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const particles = 30;
  const radius = 15;
  
  // The Swarm
  const pCenter: P3D = { x: 0, y: 0, z: 20 };
  
  for(let i=0; i<particles; i++) {
      // Create a fluid, organic flocking motion based on sine waves and time
      const a1 = (i/particles) * TAU + time*0.5;
      const a2 = (i/particles) * Math.PI*3 - time*0.3;
      
      const px = Math.cos(a1) * radius + Math.sin(a2) * 5;
      const py = Math.sin(a1) * radius + Math.cos(a2) * 5;
      const pz = 20 + Math.sin(time + i) * 10;
      
      const pCurr: P3D = { x: px, y: py, z: pz };
      
      icons.push({ p: pCurr, char: ".", size: 6, type: 'rune', meta: { colorMode: 2 } });
      
      // Temporary synaptic connections between close swarmlings
      if (i > 0 && Math.random() > 0.6) {
          const prevA = ((i-1)/particles) * TAU + time*0.5;
          const pPrev: P3D = { x: Math.cos(prevA)*radius, y: Math.sin(prevA)*radius, z: 20 + Math.sin(time + i - 1)*10 };
          lines.push({ p1: pCurr, p2: pPrev, colorMode: 3, width: 0.5 });
      }
  }

  // The swarm suddenly aligns to form a unified arrow/shape
  if (Math.sin(time*0.5) > 0.8) {
      icons.push({ p: pCenter, char: "SWARM ALIGNED", size: 6, type: 'text', meta: { colorMode: 2 } });
  }

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "DAO_SWARM", size: 0, type: 'obj', meta: { nlpId: 'dao_swarm_intelligence' }});

  return { lines, icons };
}
