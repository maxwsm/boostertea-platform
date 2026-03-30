// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - AWE (Pack 12 / 8)
// Description: The emotion of Awe (wonder). Complete neuro-synchronization.
// Visualized as a perfect, slowly rotating Platonic solid (Icosahedron) 
// glowing intensely, representing the mind comprehending something vast.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getNeuroAwe(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Golden ratio for Icosahedron vertices
  const phi = (1 + Math.sqrt(5)) / 2;
  const s = 10; // Scale

  const vertices: P3D[] = [
      {x: -s, y:  s*phi, z: 0}, {x:  s, y:  s*phi, z: 0}, {x: -s, y: -s*phi, z: 0}, {x:  s, y: -s*phi, z: 0},
      {x: 0, y: -s, z:  s*phi}, {x: 0, y:  s, z:  s*phi}, {x: 0, y: -s, z: -s*phi}, {x: 0, y:  s, z: -s*phi},
      {x:  s*phi, y: 0, z: -s}, {x:  s*phi, y: 0, z:  s}, {x: -s*phi, y: 0, z: -s}, {x: -s*phi, y: 0, z:  s}
  ].map(v => {
      // Rotate slowly along Z and Y
      const cosT = Math.cos(time*0.5);
      const sinT = Math.sin(time*0.5);
      const xRot = v.x * cosT - v.z * sinT;
      const zRot = v.x * sinT + v.z * cosT;
      return { x: xRot, y: v.y, z: zRot + 25 }; // Elevated
  });

  // Calculate distances to find edges (length should be 2*s)
  const edgeLen = 2 * s;
  for(let i=0; i<vertices.length; i++) {
        for(let j=i+1; j<vertices.length; j++) {
            const dx = vertices[i].x - vertices[j].x;
            const dy = vertices[i].y - vertices[j].y;
            const dz = vertices[i].z - vertices[j].z;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            // Allow slight floating point error tolerance
            if(Math.abs(dist - edgeLen) < 0.1) {
                // Bright white/cyan geometric connections
                lines.push({ p1: vertices[i], p2: vertices[j], colorMode: 3, width: 2.5 });
            }
        }
  }

  icons.push({ p: { x: 0, y: 0, z: 25 }, char: "SYNCHRONIZED", size: 6, type: 'text', meta: { colorMode: 3 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "NEURO_AWE", size: 0, type: 'obj', meta: { nlpId: 'awe_synchronization' }});

  return { lines, icons };
}
