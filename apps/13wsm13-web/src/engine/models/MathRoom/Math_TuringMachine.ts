// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH - TURING MACHINE (Pack 10 / 8)
// Description: Interactive abstraction of the Alan Turing state machine.
// Visualized as a 3D tape with binary code cells and a physical Play head 
// executing state logic updates over time.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../utils/math";

// Simple state rule set representation (For visual UI only)
export type TuringState = { id: string, read: string, write: string, move: 'L'|'R', next: string };

export function getTuringMachineTape(headPos: number = 0, currentTapeData: string[]): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const cellWidth = 20;
  const numCells = currentTapeData.length;
  const tLength = numCells * cellWidth;
  const startX = -tLength / 2;

  // Draw the infinite tape structure (Top and bottom rail lines)
  lines.push({ p1: { x: startX, y: -10, z: 0 }, p2: { x: startX + tLength, y: -10, z: 0 }, colorMode: 1, width: 1.0 });
  lines.push({ p1: { x: startX, y: 10, z: 0 }, p2: { x: startX + tLength, y: 10, z: 0 }, colorMode: 1, width: 1.0 });

  // Draw cell separators and data icons
  for (let i = 0; i <= numCells; i++) {
        const cx = startX + i * cellWidth;
        // Separator line
        lines.push({ p1: { x: cx, y: -10, z: 0 }, p2: { x: cx, y: 10, z: 0 }, colorMode: 1, width: 0.5 });

        // Data payload (if iterating inside a cell box)
        if (i < numCells) {
            const data = currentTapeData[i];
            const dataX = cx + cellWidth / 2;
            
            // Is Head currently over this? Highlight it
            const isHead = (i === headPos);
            
            icons.push({ 
                p: { x: dataX, y: 0, z: isHead ? 5 : 0 }, 
                char: data, 
                size: isHead ? 14 : 10, 
                type: 'text',
                meta: { colorMode: isHead ? 3 : 1 } 
            });
        }
  }

  // Draw the Read/Write Head Geometry (Hovering over tape)
  const headX = startX + headPos * cellWidth + cellWidth / 2;
  const headBaseZ = 15;
  const headTopZ = 35;
  
  const pHeadT: P3D = { x: headX, y: 0, z: headTopZ };
  const pHeadB1: P3D = { x: headX - 5, y: -5, z: headBaseZ };
  const pHeadB2: P3D = { x: headX + 5, y: -5, z: headBaseZ };
  const pHeadB3: P3D = { x: headX, y: 5, z: headBaseZ };

  // Pyramid needle pointing down at tape
  lines.push({ p1: pHeadT, p2: pHeadB1, colorMode: 2, width: 2.0 });
  lines.push({ p1: pHeadT, p2: pHeadB2, colorMode: 2, width: 2.0 });
  lines.push({ p1: pHeadT, p2: pHeadB3, colorMode: 2, width: 2.0 });
  lines.push({ p1: pHeadB1, p2: pHeadB2, colorMode: 2, width: 2.0 });
  lines.push({ p1: pHeadB2, p2: pHeadB3, colorMode: 2, width: 2.0 });
  lines.push({ p1: pHeadB3, p2: pHeadB1, colorMode: 2, width: 2.0 });

  // Status Hook
  icons.push({ p: { x: headX, y: -20, z: headTopZ }, char: "[ EXEC: STATE_0 ]", size: 8, type: 'text' });

  return { lines, icons };
}
