// ═══════════════════════════════════════════════════════════════════════
// MODEL: NEURO - JOY (Pack 12 / 4)
// Description: Visualizes Serotonin. Sun-like radiating waves, representing
// quiet confidence, peace, and long-term satisfaction.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, P3D, TAU } from "../../../utils/math";

export function getNeuroJoy(time: number = 0): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const rays = 12;
  const pCenter: P3D = { x: 0, y: 0, z: 20 };
  
  // Steady, calm outward wave
  const waveOut = (time * 5) % 20;

  for (let r = 0; r < rays; r++) {
      const a = (r / rays) * TAU;
      
      const p1: P3D = { x: Math.cos(a)*5, y: Math.sin(a)*5, z: 20 };
      const p2: P3D = { x: Math.cos(a)*25, y: Math.sin(a)*25, z: 20 };
      
      // Radiant sunbeams
      lines.push({ p1, p2, colorMode: 2, width: 3.0 }); // Solid Golden

      // Happiness droplets flowing outward
      const dropRad = waveOut + (r % 3)*5;
      icons.push({ 
          p: { x: Math.cos(a)*dropRad, y: Math.sin(a)*dropRad, z: 20 }, 
          char: "o", 
          size: 6, 
          type: 'rune', 
          meta: { colorMode: 2 } 
      });
  }

  // Stable energetic core
  icons.push({ p: pCenter, char: "(ʘ)", size: 14, type: 'text', meta: { colorMode: 2 } });

  icons.push({ p: { x: 0, y: 0, z: 0 }, char: "NEURO_JOY", size: 0, type: 'obj', meta: { nlpId: 'joy_serotonin' }});

  return { lines, icons };
}
