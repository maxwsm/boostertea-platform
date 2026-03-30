// ═══════════════════════════════════════════════════════════════════════
// MODEL 01: THE VITRUVIAN MAN (Genesis Act)
// Description: Generates the 3D geometry for Episode 00 (Genesis).
// Left hemisphere represents DNA/Biology (fluid lines).
// Right hemisphere represents Cybernetics/Web3 (strict grid/fractals).
// ═══════════════════════════════════════════════════════════════════════

import { P3D, PLine, PIcon, sphToCart } from "../utils/math";

// Constants for the scene
export const VITRUVIAN_LAT = 0.06; 
export const VITRUVIAN_RADIUS = 0.005; // Size in spherical angle

export function generateVitruvianMan(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // 1. THE DA VINCI RING (Perfect Circle)
  // Left side: smooth. Right side: jagged (glitched).
  const ringSegments = 120;
  for (let i = 0; i < ringSegments; i++) {
    const a1 = (i / ringSegments) * Math.PI * 2;
    const a2 = ((i + 1) / ringSegments) * Math.PI * 2;
    
    // Left side of circle (Math.cos < 0)
    let r1 = VITRUVIAN_RADIUS;
    let r2 = VITRUVIAN_RADIUS;

    if (Math.cos(a1) > 0) r1 += (Math.random() - 0.5) * 0.0005; // Glitch Right
    if (Math.cos(a2) > 0) r2 += (Math.random() - 0.5) * 0.0005; // Glitch Right

    const p1 = sphToCart(VITRUVIAN_LAT + Math.sin(a1) * r1, Math.cos(a1) * r1, 100);
    const p2 = sphToCart(VITRUVIAN_LAT + Math.sin(a2) * r2, Math.cos(a2) * r2, 100);
    
    lines.push({ p1, p2, colorMode: Math.cos(a1) > 0 ? 2 : 1, width: 1.5 }); // colorMode 2 = Cypherpunk, 1 = Bio
  }

  // 2. THE SQUARE
  // Only present on the Right Side (Cybernetics).
  const squareCorners = [
    { x: 1, y: 1 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 1 }
  ];
  for (let i = 0; i < squareCorners.length - 1; i++) {
    const p1 = sphToCart(VITRUVIAN_LAT + squareCorners[i].y * VITRUVIAN_RADIUS, squareCorners[i].x * VITRUVIAN_RADIUS, 100);
    const p2 = sphToCart(VITRUVIAN_LAT + squareCorners[i+1].y * VITRUVIAN_RADIUS, squareCorners[i+1].x * VITRUVIAN_RADIUS, 100);
    lines.push({ p1, p2, colorMode: 2, width: 1.0 });
  }
  
  // Close the right side of the square to the center axis
  lines.push({ 
    p1: sphToCart(VITRUVIAN_LAT + 1 * VITRUVIAN_RADIUS, 1 * VITRUVIAN_RADIUS, 100), 
    p2: sphToCart(VITRUVIAN_LAT - 1 * VITRUVIAN_RADIUS, 1 * VITRUVIAN_RADIUS, 100), 
    colorMode: 2, width: 1.0 
  });

  // 3. THE BODY STRUCTURE (Abstract Lines)
  // Left: Curved DNA-like splines
  for (let y = -0.8; y < 0.8; y += 0.1) {
    // DNA Helix simulation on Left (-x values)
    const x1 = -0.002 + Math.sin(y * 20) * 0.001;
    const x2 = -0.002 + Math.sin((y + 0.1) * 20) * 0.001;
    const p1 = sphToCart(VITRUVIAN_LAT + y * VITRUVIAN_RADIUS, x1, 100);
    const p2 = sphToCart(VITRUVIAN_LAT + (y + 0.1) * VITRUVIAN_RADIUS, x2, 100);
    lines.push({ p1, p2, colorMode: 1, width: 1.2 });
  }

  // Right: Hard grid logic
  for (let y = -0.8; y < 0.8; y += 0.2) {
    const p1 = sphToCart(VITRUVIAN_LAT + y * VITRUVIAN_RADIUS, 0, 100);
    const p2 = sphToCart(VITRUVIAN_LAT + y * VITRUVIAN_RADIUS, +0.003, 100);
    lines.push({ p1, p2, colorMode: 2, width: 1.0 });
  }

  // 4. FLOATING DATA NODES
  // Left: Runic
  // Right: Binary/Code
  const runicSymbols = "ᚠᛟᛒᚷᛉᚹᛋᛞᛝᛃᛗᚨᚲ";
  const cyberSymbols = ["0", "1", "<", "/>", "};"];
  
  for (let i = 0; i < 40; i++) {
    const isRight = Math.random() > 0.5;
    const ang = Math.random() * Math.PI * 2;
    const r = Math.random() * VITRUVIAN_RADIUS * 1.5;
    
    // Force coordinates to their respective sides
    let finalLon = Math.cos(ang) * r;
    if (isRight && finalLon < 0) finalLon *= -1;
    if (!isRight && finalLon > 0) finalLon *= -1;
    
    const p = sphToCart(VITRUVIAN_LAT + Math.sin(ang) * r, finalLon, 110 + Math.random() * 20);
    const char = isRight 
      ? cyberSymbols[Math.floor(Math.random() * cyberSymbols.length)]
      : runicSymbols[Math.floor(Math.random() * runicSymbols.length)];
      
    icons.push({
      p,
      char,
      size: 10 + Math.random() * 15,
      type: isRight ? 'text' : 'rune',
      meta: { originalPos: { ...p }, targetPos: { ...p } } // For future shatter effect
    });
  }

  // 5. SIGNATURE & MANIFESTO LABELS (Hovering around)
  icons.push({ p: sphToCart(VITRUVIAN_LAT - 0.006, 0, 120), char: "[ THE ARCHIVATOR ]", size: 30, type: 'text' });
  icons.push({ p: sphToCart(VITRUVIAN_LAT + 0.006, -0.005, 120), char: "BIO_SYNC", size: 14, type: 'text' });
  icons.push({ p: sphToCart(VITRUVIAN_LAT + 0.006, 0.005, 120), char: "CYBER_SYNC", size: 14, type: 'text' });
  
  return { lines, icons };
}
