// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - INTERACTIVE TRIGGER (Pack 12 / 10)
// Description: The central control desk in the room where the user can 
// explicitly trigger the neural models to "react" at 100% capacity.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getNeuroInteractiveTrigger(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // A sleek floating console
  const pConsole: P3D = { x: 0, y: 0, z: 10 };
  
  lines.push({ p1: { x: -10, y: -5, z: 10 }, p2: { x: 10, y: -5, z: 10 }, colorMode: 1, width: 2.0 });
  lines.push({ p1: { x: -10, y: 5, z: 10 }, p2: { x: 10, y: 5, z: 10 }, colorMode: 1, width: 2.0 });

  // 7 Buttons corresponding to the 7 neural states
  const states = ['FEAR', 'LOVE', 'JOY', 'JACKPOT', 'SADNESS', 'INTEREST', 'AWE'];
  
  for(let i=0; i<7; i++) {
        const bx = -7.5 + i*2.5;
        // Draw buttons
        icons.push({ p: { x: bx, y: 0, z: 11 }, char: "o", size: 6, type: 'rune', meta: { colorMode: 1 } });
        
        // Interactive UI logic hooks for the engine to know this is a button
        icons.push({ 
            p: { x: bx, y: 0, z: 11 }, 
            char: "", 
            size: 0, 
            type: 'obj', 
            meta: { isNeuroButton: true, triggerState: states[i] } 
        });
  }

  // Label
  icons.push({ p: { x: 0, y: 0, z: 15 }, char: "[ INJECT STIMULUS ]", size: 6, type: 'text' });

  return { lines, icons };
}
