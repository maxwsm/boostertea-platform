// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH - CONSTRUCTIVE INTERFERENCE (Pack 10 / 7)
// Description: A 3D topographical mesh visualizing the physics principle 
// of constructive interference between two wave sources resulting in 
// reinforced peaks. Time variable controls animation inside the canvas.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../utils/math";

export function getInterferencePattern(timeTick: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // The two wave sources positioned on the grid
  const source1: P3D = { x: -30, y: -30, z: 0 };
  const source2: P3D = { x: 30, y: 30, z: 0 };

  const frequency = 0.2;
  const amplitude = 15;
  const phase = timeTick * 2.0; // Animates the wave outward

  const gridSize = 40; // 40x40 mesh resolution
  const step = 4;      // Distance between grid nodes
  const offset = (gridSize * step) / 2;

  // Pre-calculate heights into a 2D array
  const heights: number[][] = [];
  for (let ix = 0; ix <= gridSize; ix++) {
      heights[ix] = [];
      for (let iy = 0; iy <= gridSize; iy++) {
          const physX = ix * step - offset;
          const physY = iy * step - offset;
          
          // Distance from sources
          const d1 = Math.sqrt(Math.pow(physX - source1.x, 2) + Math.pow(physY - source1.y, 2));
          const d2 = Math.sqrt(Math.pow(physX - source2.x, 2) + Math.pow(physY - source2.y, 2));

          // Superposition Principle: h = sin(kd1 - wt) + sin(kd2 - wt)
          const h1 = Math.sin(d1 * frequency - phase);
          const h2 = Math.sin(d2 * frequency - phase);
          
          // Total constructive/destructive height
          heights[ix][iy] = (h1 + h2) * amplitude;
      }
  }

  // Generate Mesh Lines from heights
  for (let ix = 0; ix < gridSize; ix++) {
      for (let iy = 0; iy < gridSize; iy++) {
          
          const px = ix * step - offset;
          const py = iy * step - offset;

          const p1: P3D = { x: px, y: py, z: heights[ix][iy] };
          const p2: P3D = { x: px + step, y: py, z: heights[ix+1][iy] };
          const p3: P3D = { x: px, y: py + step, z: heights[ix][iy+1] };

          // Constructive reinforcement coloring (peaks > threshold glow neon)
          const isInterferencePeakX = heights[ix][iy] > (amplitude * 1.5) || heights[ix+1][iy] > (amplitude * 1.5);
          const isInterferencePeakY = heights[ix][iy] > (amplitude * 1.5) || heights[ix][iy+1] > (amplitude * 1.5);

          // X direction lines
          lines.push({ p1, p2, colorMode: isInterferencePeakX ? 3 : 1, width: isInterferencePeakX ? 1.5 : 0.4 });
          // Y direction lines
          lines.push({ p1, p2: p3, colorMode: isInterferencePeakY ? 3 : 1, width: isInterferencePeakY ? 1.5 : 0.4 });
      }
  }

  // Label sources
  icons.push({ p: { x: source1.x, y: source1.y, z: -20 }, char: "S1", size: 8, type: 'text' });
  icons.push({ p: { x: source2.x, y: source2.y, z: -20 }, char: "S2", size: 8, type: 'text' });

  return { lines, icons };
}
