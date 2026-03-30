// ═══════════════════════════════════════════════════════════════════════
// MODEL: WHISPER AI LARYNX (Pack 8 / 15)
// Description: The Synapse Weaver's voice decryption matrix. Modeled like 
// the inner mesh of a studio microphone intercepting sound waves.
// Coordinate Space: LAT 0.20, Hovering independently on the right
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getWhisperAILarynx(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  // Placed at the West coordinates (Math.PI)
  const angle = Math.PI; // Opposite to the Rift
  const oLat = baseLat + Math.cos(angle) * (radius * 0.9);
  const oLon = Math.sin(angle) * (radius * 0.9);
  const baseElev = 60;

  // Render a dense sphere-like Mesh representing a microphone diaphragm
  const loops = 12;
  const segments = 16;
  const micRadius = 0.005;

  for (let i = 0; i <= loops; i++) {
      const latAngle = (i / loops) * Math.PI; // 0 to PI
      const ringRadius = Math.sin(latAngle) * micRadius;
      const ringElev = baseElev + Math.cos(latAngle) * 30; // 30 is vertical scale
      
      for (let j = 0; j < segments; j++) {
          const lonA1 = (j / segments) * TAU;
          const lonA2 = ((j + 1) / segments) * TAU;
          
          if (ringRadius > 0.0001) { // Avoid top/bottom poles division by zero
              const p1 = sphToCart(oLat + Math.cos(lonA1) * ringRadius, oLon + Math.sin(lonA1) * ringRadius, ringElev);
              const p2 = sphToCart(oLat + Math.cos(lonA2) * ringRadius, oLon + Math.sin(lonA2) * ringRadius, ringElev);
              lines.push({ p1, p2, colorMode: 1, width: 0.5 }); // White/Grey mesh
          }

          // Vertical mesh lines connections
          if (i < loops) {
              const latAngleNext = ((i + 1) / loops) * Math.PI;
              const ringRadiusNext = Math.sin(latAngleNext) * micRadius;
              const ringElevNext = baseElev + Math.cos(latAngleNext) * 30;
              
              const pA = sphToCart(oLat + Math.cos(lonA1) * ringRadius, oLon + Math.sin(lonA1) * ringRadius, ringElev);
              const pB = sphToCart(oLat + Math.cos(lonA1) * ringRadiusNext, oLon + Math.sin(lonA1) * ringRadiusNext, ringElevNext);
              lines.push({ p1: pA, p2: pB, colorMode: 1, width: 0.2 });
          }
      }
  }

  // Sine Wave (Audio Graph) running through the center
  const wavePoints = 20;
  for (let w = 0; w < wavePoints; w++) {
      const prog = w / wavePoints;
      // Audio sine wave matching amplitude
      const offset = Math.sin(prog * Math.PI * 4) * 0.002;
      const p1 = sphToCart(oLat, oLon + offset, baseElev - 30 + (prog * 60));
      const p2 = sphToCart(oLat, oLon + Math.sin((prog + 0.05) * Math.PI * 4) * 0.002, baseElev - 30 + ((prog + 0.05) * 60));
      
      if (w < wavePoints - 1) {
          lines.push({ p1, p2, colorMode: 3, width: 2.0 }); // Glowing green wave
      }
  }

  // Data decoding visualizers
  icons.push({ p: sphToCart(oLat - 0.01, oLon - 0.005, baseElev + 45), char: "[ ███████░░░░░ ]", size: 10, type: 'text', meta: { isAudioProgressBar: true } });
  icons.push({ p: sphToCart(oLat - 0.012, oLon - 0.005, baseElev + 35), char: "DECODING VOICE ENTROPY (WHISPER AI)", size: 12, type: 'text' });
  icons.push({ p: sphToCart(oLat - 0.014, oLon - 0.005, baseElev + 25), char: "BOT_INTENT_FILTER = TRUE", size: 10, type: 'text' });

  return { lines, icons };
}
