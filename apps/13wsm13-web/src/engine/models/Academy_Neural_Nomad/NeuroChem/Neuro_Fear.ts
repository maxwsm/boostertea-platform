// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - FEAR (Pack 12 / 2)
// Description: Visualizes Cortisol and Adrenaline spikes. Represents
// the sharp, jagged, and defensive state of the brain in panic.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getNeuroFear(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Fear is jagged and unstable
  const pulse = Math.abs(Math.sin(time * 10)); // Very fast heartbeat
  const radius = 10 + pulse * 5;
  
  const nodes = 12;
  const pCenter: P3D = { x: 0, y: 0, z: 20 };

  for (let i = 0; i < nodes; i++) {
        const a1 = (i / nodes) * TAU;
        const a2 = ((i + 1) / nodes) * TAU;

        // Spikes shooting outward
        const jitter1 = (Math.random() - 0.5) * 10 * pulse;
        const jitter2 = (Math.random() - 0.5) * 10 * pulse;

        const p1: P3D = { x: Math.cos(a1)*(radius+jitter1), y: Math.sin(a1)*(radius+jitter1), z: 20 + jitter1 };
        const p2: P3D = { x: Math.cos(a2)*(radius+jitter2), y: Math.sin(a2)*(radius+jitter2), z: 20 + jitter2 };
        
        // Color 3 mapped to RED warning
        lines.push({ p1, p2, colorMode: 3, width: 2.0 });
        
        // Sharp connections to center
        lines.push({ p1: pCenter, p2: p1, colorMode: 3, width: 1.0 });

        // Threat indicators
        if(i % 3 === 0) icons.push({ p: p1, char: "!", size: 8, type: 'rune', meta: { colorMode: 3 } });
  }

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "NEURO_FEAR", size: 0, type: 'obj', meta: { nlpId: 'fear_response' }});

  return { lines, icons };
}
