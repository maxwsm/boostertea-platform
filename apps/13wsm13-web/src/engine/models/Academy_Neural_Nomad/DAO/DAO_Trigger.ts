// ═══════════════════════════════════════════════════════════════════════
// MODEL: DAO - THE INDUCTION TRIGGER (Pack 16 / 10)
// Description: The grand finale interactive monument of the Academy.
// A massive glowing button inviting the user to step out of the Academy
// and actually mint/join the ecosystem in real-time.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getDaoInductionTrigger(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const pulse = Math.abs(Math.sin(time*3)) * 5;
  const radius = 20 + pulse;
  
  // The giant interactive Ring
  for (let i = 0; i < 36; i++) {
        const a1 = (i / 36) * TAU;
        const a2 = ((i + 1) / 36) * TAU;
        
        lines.push({ 
            p1: { x: Math.cos(a1)*radius, y: Math.sin(a1)*radius, z: 15 }, 
            p2: { x: Math.cos(a2)*radius, y: Math.sin(a2)*radius, z: 15 }, 
            colorMode: 2, width: 4.0 
        });
  }

  // Core induction portal
  icons.push({ p: { x: 0, y: 0, z: 15 }, char: "[ INITIATE: BECOME A NOMAD ]", size: 12, type: 'text', meta: { colorMode: 2, isPulsing: true } });

  // Engine hooks this to open phantom wallet / web3 auth
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "TRIGGER", size: 0, type: 'obj', meta: { triggerState: 'OPEN_WEB3_AUTH' }});

  return { lines, icons };
}
