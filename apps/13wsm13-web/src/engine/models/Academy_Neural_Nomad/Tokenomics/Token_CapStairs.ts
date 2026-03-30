// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOKENOMICS - CAPITALIZATION STAIRS (Pack 11 / 6)
// Description: An ascending, floating spiraling staircase. Conceptually 
// maps user holding time (Patience/Staking) to compounding interest 
// and exponential asset growth.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getTokenCapStairs(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const stepCount = 12;
  const radius = 15;
  const stepHeight = 5;
  const stepWidth = 10;

  let pPrevInner: P3D | null = null;
  let pPrevOuter: P3D | null = null;

  for (let i = 0; i < stepCount; i++) {
        // Spiral upwards
        const a = (i / stepCount) * (TAU * 1.5); 
        const z = i * stepHeight;

        // Inner and Outer points for the step platform
        const inner: P3D = {
            x: Math.cos(a) * (radius - stepWidth/2),
            y: Math.sin(a) * (radius - stepWidth/2),
            z: z
        };
        const outer: P3D = {
            x: Math.cos(a) * (radius + stepWidth/2),
            y: Math.sin(a) * (radius + stepWidth/2),
            z: z
        };

        // Draw step tread
        lines.push({ p1: inner, p2: outer, colorMode: (i===stepCount-1) ? 3 : 1, width: 1.5 });

        // Connect to previous step (Risers)
        if (pPrevInner && pPrevOuter) {
            lines.push({ p1: inner, p2: pPrevInner, colorMode: 1, width: 0.8 });
            lines.push({ p1: outer, p2: pPrevOuter, colorMode: 1, width: 0.8 });
            
            // Vertical risers
            lines.push({ p1: pPrevInner, p2: { x: pPrevInner.x, y: pPrevInner.y, z: z }, colorMode: 1, width: 0.5 });
            lines.push({ p1: pPrevOuter, p2: { x: pPrevOuter.x, y: pPrevOuter.y, z: z }, colorMode: 1, width: 0.5 });
        }

        // Projecting compounding mathematical growth per step
        const compoundingValue = Math.pow(1.618, i); // Fibonacci golden ratio pacing
        if (i % 2 === 0) {
            icons.push({ p: outer, char: `[ x${compoundingValue.toFixed(1)} ]`, size: 6, type: 'text', meta: { colorMode: 2 } });
        }

        pPrevInner = inner;
        pPrevOuter = outer;
  }

  // The glowing apex
  icons.push({ 
      p: { x: pPrevOuter!.x, y: pPrevOuter!.y, z: (stepCount-1)*stepHeight + 10 }, 
      char: "FINANCIAL SINGULARITY", 
      size: 10, 
      type: 'text',
      meta: { isApex: true } 
  });

  // NLP Tooltip Anchor
  icons.push({ p: { x: 0, y: 0, z: stepCount * stepHeight + 20 }, char: "STAIRS_INFO", size: 0, type: 'obj', meta: { nlpId: 'cap_stairs' }});

  return { lines, icons };
}
