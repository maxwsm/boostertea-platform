// ═══════════════════════════════════════════════════════════════════════
// MODEL: MATH - GOLDBACH CONJECTURE ARCHES (Pack 10 / 5)
// Description: A 3D line spanning the X-axis representing even integers.
// Arches (semicircles in Z/Y space) leap out connecting prime pairs (p1+p2).
// Coordinate Space: Isolated Origin (0,0,0) inside the painting view
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../utils/math";

// Simple Prime Checker for small visual simulation
function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

export function getGoldbachConjecture(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const span = 60; // Calculate up to Even number 60
  const scaleX = 4; // Spacing between numbers
  
  const xOffset = -(span * scaleX) / 2;

  // Draw the baseline (X Axis representing Even Numbers)
  const pStart: P3D = { x: xOffset, y: 0, z: 0 };
  const pEnd: P3D = { x: xOffset + span*scaleX, y: 0, z: 0 };
  lines.push({ p1: pStart, p2: pEnd, colorMode: 1, width: 2.0 });

  // For each even number N > 2, find one prime pair (p1, p2)
  for (let N = 4; N <= span; N += 2) {
      
      let foundP1 = 0;
      let foundP2 = 0;

      // Find the simplest pair
      for (let p1 = 2; p1 <= N/2; p1++) {
          if (isPrime(p1) && isPrime(N - p1)) {
              foundP1 = p1;
              foundP2 = N - p1;
              break; 
          }
      }

      if (foundP1 > 0) {
          // Draw a 3D parabolic arch connecting p1 and p2
          const p1X = xOffset + foundP1 * scaleX;
          const p2X = xOffset + foundP2 * scaleX;
          
          const midX = (p1X + p2X) / 2;
          const archHeight = (foundP2 - foundP1) * 2; // Radius/Height of arch

          const segments = 12;
          let pPrev: P3D | null = null;
          
          for(let i=0; i<=segments; i++){
              const t = i / segments;
              const angle = t * Math.PI; // Semicircle

              // Arch exists on the X/Z plane wrapping around the axis
              const currX = midX + Math.cos(Math.PI - angle) * (archHeight/2);
              const currZ = Math.sin(angle) * archHeight;
              
              // Rotate slightly on Y to fan out the arches organically
              const currY = Math.sin(angle) * (N % 3 === 0 ? 15 : -15);

              const pCurrent: P3D = { x: currX, y: currY, z: currZ };
              
              if (pPrev) {
                  lines.push({ p1: pPrev, p2: pCurrent, colorMode: 3, width: 0.5 });
              }
              pPrev = pCurrent;
          }

          // Node labeling
          if (N % 10 === 0) {
              icons.push({ p: { x: pEnd.x + 20, y: 0, z: archHeight }, char: `${N} = ${foundP1} + ${foundP2}`, size: 8, type: 'text' });
          }
      }
  }

  return { lines, icons };
}
