// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH - GOLDBACH COMET (Pack 10 / 6)
// Description: Interactive 3D scatter plot of the Goldbach Partitions.
// X-axis: Even number E. Y-axis: Number of prime pairs (p1+p2) that sum to E.
// The resulting visual resembles a comet tail splitting into bands.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D } from "../../utils/math";

function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// Optimization for Comet generation (count pairs instead of storing them)
function countGoldbachPairs(n: number): number {
    let count = 0;
    for (let p1 = 2; p1 <= n / 2; p1++) {
        if (isPrime(p1) && isPrime(n - p1)) {
            count++;
        }
    }
    return count;
}

export function getGoldbachComet(userLimitN: number = 2000): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Hard limit for browser performance safety in isolated view
  const safeLimit = Math.min(userLimitN, 5000);
  
  const scaleX = 0.5; // Spread on X axis
  const scaleY = 2.0; // Height of comet peaks
  const spanScale = safeLimit * scaleX;
  const xOffset = -spanScale / 2;

  // Base X Axis
  lines.push({ p1: { x: xOffset, y: 0, z: 0 }, p2: { x: xOffset + spanScale, y: 0, z: 0 }, colorMode: 0, width: 1.0 });

  // Generate the scatter plot
  for (let N = 4; N <= safeLimit; N += 2) {
      const g_n = countGoldbachPairs(N); // number of ways to write N as p1 + p2
      
      const px = xOffset + N * scaleX;
      // We will project the comet on the Y axis, and slightly stagger it on Z for volume
      const py = g_n * scaleY;
      const pz = (Math.random() - 0.5) * (py * 0.1); // Add volumetric thickness to the tail

      // Render as a glowing pixel/rune
      icons.push({ 
          p: { x: px, y: py, z: pz }, 
          char: ".", 
          size: 4 + (g_n * 0.05), // Higher dots are slightly larger
          type: 'rune', 
          meta: { colorMode: 3, isScatterPoint: true } // The comet tail color 
      });
  }

  // Floating Label
  icons.push({ p: { x: 0, y: -20, z: 0 }, char: `G(E) LIMIT: ${safeLimit}`, size: 12, type: 'text' });
  
  // Interactive metadata hook for Canvas engine
  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "", size: 0, type: 'obj', meta: { isInteractiveVar: true, currentVal: userLimitN, maxVal: 50000, trigger: 'RECALC_COMET' } });

  return { lines, icons };
}
