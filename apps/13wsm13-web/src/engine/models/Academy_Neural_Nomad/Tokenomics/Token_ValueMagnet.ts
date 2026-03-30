// ═══════════════════════════════════════════════════════════════════════
// MODEL: TOKENOMICS - VALUE MAGNET (Pack 11 / 4)
// Description: A massive U-shaped electromagnet pulling floating data 
// particles into a safe core, representing Staking and Deflationary Burn.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getTokenValueMagnet(): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // U shape
  const width = 20;
  const height = 30;
  
  // Left pole
  const pTL: P3D = { x: -width/2, y: 0, z: height };
  const pBL: P3D = { x: -width/2, y: 0, z: 0 };
  
  // Right pole
  const pTR: P3D = { x: width/2, y: 0, z: height };
  const pBR: P3D = { x: width/2, y: 0, z: 0 };

  // Bottom curve (Simulated with lines)
  lines.push({ p1: pTL, p2: pBL, colorMode: 1, width: 3.0 });
  lines.push({ p1: pTR, p2: pBR, colorMode: 1, width: 3.0 });
  lines.push({ p1: pBL, p2: pBR, colorMode: 1, width: 3.0 });

  // Floating value particles being pulled (Deflation/Burn visual)
  const particles = 20;
  for(let i=0; i<particles; i++) {
      const px = (Math.random() - 0.5) * 40;
      const py = (Math.random() - 0.5) * 40;
      const pz = height + 10 + Math.random() * 20; // Hovering above magnet

      icons.push({ p: { x: px, y: py, z: pz }, char: "MAX_SUPPLY", size: 4, type: 'rune', meta: { isPulled: true, colorMode: 2 } });
      
      // Laser lines pulling them down
      if(i % 3 === 0) {
          const targetPole = (px < 0) ? pTL : pTR;
          lines.push({ p1: { x: px, y: py, z: pz }, p2: targetPole, colorMode: 2, width: 0.2 });
      }
  }

  // Deflation core
  icons.push({ p: { x: 0, y: 0, z: height / 2 }, char: "0x0000..dEaD (BURN)", size: 6, type: 'text' });

  // NLP Tooltip Anchor
  icons.push({ p: { x: 0, y: 0, z: height + 40 }, char: "MAGNET_INFO", size: 0, type: 'obj', meta: { nlpId: 'value_magnet' }});

  return { lines, icons };
}
