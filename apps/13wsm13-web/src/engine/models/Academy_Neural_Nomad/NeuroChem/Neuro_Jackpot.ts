// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - JACKPOT (Pack 12 / 5)
// Description: Absolute Dopamine flood. The feeling of extreme reward,
// finding a hidden gem, or hitting the ultimate win condition. 
// Visualized as an explosive, hyper-active fireworks cluster.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../../utils/math";

export function getNeuroJackpot(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pCenter: P3D = { x: 0, y: 0, z: 25 };
  const fragments = 40;

  // Explosive rapid scaling
  const blast = (Math.sin(time * 15) * 0.5 + 0.5);

  for (let i = 0; i < fragments; i++) {
        // Random spherical spray
        const phi = Math.random() * Math.PI * 2;
        const costheta = Math.random() * 2 - 1;
        const theta = Math.acos(costheta);
        
        const radius = 10 + Math.random() * 20 * blast;

        const p1: P3D = {
            x: pCenter.x + radius * Math.sin(theta) * Math.cos(phi),
            y: pCenter.y + radius * Math.sin(theta) * Math.sin(phi),
            z: pCenter.z + radius * Math.cos(theta)
        };

        // Flashy connecting beams that disappear and reappear
        if (Math.random() < 0.5) {
            lines.push({ p1: pCenter, p2: p1, colorMode: 3, width: 3.0 });
        }

        icons.push({ 
            p: p1, 
            char: Math.random() > 0.5 ? "★" : "$", 
            size: 8 + blast*10, 
            type: 'rune', 
            meta: { colorMode: 3, isJackpot: true } 
        });
  }

  // Core massive blast ring
  const cRad = 15 * blast;
  const pCL: P3D = { x: -cRad, y: 0, z: 25 };
  const pCR: P3D = { x: cRad, y: 0, z: 25 };
  lines.push({ p1: pCL, p2: pCR, colorMode: 3, width: 8.0 });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "NEURO_JACKPOT", size: 0, type: 'obj', meta: { nlpId: 'jackpot_dopamine' }});

  return { lines, icons };
}
