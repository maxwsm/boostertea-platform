// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOKENOMICS - CIRCULATION WHEEL (Pack 11 / 5)
// Description: A massive kinetic wheel powered by transactions.
// It visualizes the 'Velocity of Money' concept where continuous 
// flow keeps the ecosystem healthy and expanding.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getTokenCircWheel(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const wheelRadius = 25;
  const cx = 0, cy = 0, cz = 25; // Elevated wheel
  const wheelSpeed = time * 0.5;

  const spokes = 8;
  const segments = 32;

  // Draw the outer rim
  let pPrev: P3D | null = null;
  let pFirst: P3D | null = null;

  for (let i = 0; i < segments; i++) {
        const a = (i / segments) * TAU + wheelSpeed;
        
        // Spin on the X/Z axis like a ferris wheel (perpendicular to viewer)
        const px = cx + Math.cos(a) * wheelRadius;
        const py = cy; 
        const pz = cz + Math.sin(a) * wheelRadius;
        
        const pCurr: P3D = { x: px, y: py, z: pz };
        
        if (pPrev) lines.push({ p1: pPrev, p2: pCurr, colorMode: 1, width: 2.0 });
        else pFirst = pCurr;
        
        pPrev = pCurr;

        // Transaction nodes racing around the rim
        if (i % 4 === 0) {
            icons.push({ p: pCurr, char: "TX", size: 6, type: 'rune', meta: { colorMode: 2 } });
        }
  }
  if (pFirst && pPrev) lines.push({ p1: pPrev, p2: pFirst, colorMode: 1, width: 2.0 });

  // Draw the spinning spokes
  const pCenter: P3D = { x: cx, y: cy, z: cz };
  for(let j=0; j<spokes; j++) {
      const a = (j / spokes) * TAU + wheelSpeed;
      const px = cx + Math.cos(a) * wheelRadius;
      const pz = cz + Math.sin(a) * wheelRadius;
      lines.push({ p1: pCenter, p2: { x: px, y: cy, z: pz }, colorMode: 1, width: 1.0 });

      // Energy particles moving FROM center OUTWARD to simulate growth
      const t = (Math.sin(time * 2 + j) + 1) / 2; // Pulsing 0 to 1
      const eX = cx + Math.cos(a) * (wheelRadius * t);
      const eZ = cz + Math.sin(a) * (wheelRadius * t);
      icons.push({ p: { x: eX, y: cy, z: eZ }, char: "+", size: 8, type: 'rune', meta: { colorMode: 3, isPulsing: true } });
  }

  // Axle core
  icons.push({ p: pCenter, char: "( V )", size: 10, type: 'text' });

  // NLP Tooltip Anchor
  icons.push({ p: { x: 0, y: 0, z: cz * 2 + 10 }, char: "WHEEL_INFO", size: 0, type: 'obj', meta: { nlpId: 'circulation_wheel' }});

  return { lines, icons };
}
