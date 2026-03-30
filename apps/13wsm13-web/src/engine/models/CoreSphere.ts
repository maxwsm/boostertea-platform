// ═══════════════════════════════════════════════════════════════════════
// MODEL 00: THE CORE SPHERE & DNA MATRIX
// Description: The absolutely massive Foundation Sphere that creates the
// 33-Episode "Treadmill" scroll effect. At its geometric center (0,0,0)
// sits the DNA Matrix of the Founder.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU, R } from "../utils/math";

export function generateCoreSphere(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];

  // 1. THE MASSIVE TREADMILL GRID (The Ocean of Code)
  const lats = 30; // Grid density
  const lons = 40; 
  
  // We only draw a section of the sphere to save performance (Frustum optimization logic)
  // MasterCanvas will handle culling, but here we define the massive grid from pole to pole.
  for (let i = 0; i <= lats; i++) {
    const lat = (i / lats) * Math.PI; // 0 to PI
    for (let j = 0; j <= lons; j++) {
      const lon = (j / lons) * TAU;
      
      const p1 = sphToCart(lat, lon, 0); // Ground level (Elev = 0)
      
      if (j < lons) { // Horizontal lines
        const p2 = sphToCart(lat, ((j + 1) / lons) * TAU, 0);
        // Dim wireframe (colorMode: 0 = very low opacity background)
        lines.push({ p1, p2, colorMode: 0, width: 0.3 }); 
      }
      if (i < lats) { // Vertical lines
        const p3 = sphToCart(((i + 1) / lats) * Math.PI, lon, 0);
        lines.push({ p1, p2: p3, colorMode: 0, width: 0.3 });
      }
    }
  }

  // 2. THE DNA MATRIX (AT GEOMETRIC ABSOLUTE ZERO: 0,0,0)
  // R is 15000 (planet surface). To put something at the center of the planet, 
  // we do not use sphToCart, we output literal cartesian {x:0, y:0, z:0}.
  const dnaHeight = 4000;  // Massive core structure
  const dnaRadius = 500;
  const turns = 10;
  const steps = 150;

  for (let i = 0; i < steps; i++) {
    const t = i / steps; // 0 to 1
    const y = -dnaHeight/2 + t * dnaHeight;
    const angle1 = t * TAU * turns;
    const angle2 = angle1 + Math.PI; // Opposite strand

    // STRAND 1: BIOLOGY (Left/Organic motif)
    const pBio = {
        x: Math.cos(angle1) * dnaRadius,
        y: y,
        z: Math.sin(angle1) * dnaRadius
    };
    
    // STRAND 2: CYBERNETICS (Right/Code motif)
    const pCyber = {
        x: Math.cos(angle2) * dnaRadius,
        y: y,
        z: Math.sin(angle2) * dnaRadius
    };

    // Draw the rungs (Connectors between Bio and Cyber)
    if (i % 3 === 0) {
        lines.push({ p1: pBio, p2: pCyber, colorMode: 2, width: 1.0 }); // Cyber green
    }

    // Nodes on the strands
    icons.push({ 
        p: pBio, 
        char: "•", // Organic cell
        size: 8, 
        type: 'rune',
        meta: { isBioCore: true } 
    });

    icons.push({ 
        p: pCyber, 
        char: ["0", "1", "{", "}"][Math.floor(Math.random() * 4)], // Code data
        size: 10, 
        type: 'text',
        meta: { isCyberCore: true } 
    });
  }

  // THE HEART OF THE MATRIX
  icons.push({
      p: { x: 0, y: 0, z: 0 },
      char: "13WSM13_CORE_NODE",
      size: 40,
      type: 'text',
      meta: { isAbsoluteCenter: true }
  });

  return { lines, icons };
}
