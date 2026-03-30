// ═══════════════════════════════════════════════════════════════════════
// MODEL: HEARTBEAT NODE (Pack 2 / 14)
// Description: The central core of the Vitruvian geometry. It pulsates 
// rhythmically. This node is tied to the navigator.vibrate Haptic engine.
// Coordinate Space: LAT 0.06, Exact Center of chest (Elev 0)
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getHeartBeatNode(baseLat: number, elev: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const hLat = baseLat - 0.001; // Chest level, slightly up from perfect center
  const hLon = 0; // Absolute horizontal center
  
  // The Star/Pulse geometry (A small diamond acting as a heart)
  const renderScale = 0.0004;

  const pTop = sphToCart(hLat - renderScale, hLon, elev);
  const pBottom = sphToCart(hLat + renderScale, hLon, elev);
  const pLeft = sphToCart(hLat, hLon - renderScale, elev);
  const pRight = sphToCart(hLat, hLon + renderScale, elev);

  // Red/Glowing
  lines.push({ p1: pTop, p2: pRight, colorMode: 2, width: 3.0 });
  lines.push({ p1: pRight, p2: pBottom, colorMode: 2, width: 3.0 });
  lines.push({ p1: pBottom, p2: pLeft, colorMode: 2, width: 3.0 });
  lines.push({ p1: pLeft, p2: pTop, colorMode: 2, width: 3.0 });

  // Radiating pulse lines (4 diagonal spikes)
  for (let i=0; i<4; i++) {
        const a = (i/4) * TAU + Math.PI/4;
        const p1 = sphToCart(hLat + Math.sin(a)*renderScale, hLon + Math.cos(a)*renderScale, elev);
        const p2 = sphToCart(hLat + Math.sin(a)*renderScale*3, hLon + Math.cos(a)*renderScale*3, elev);
        lines.push({ p1, p2, colorMode: 2, width: 1.0 });
  }

  // The Haptic Identity
  icons.push({ p: sphToCart(hLat, hLon, elev + 5), char: "CORE_PULSE", size: 0, type: 'obj', meta: { isHeartbeat: true, bpm: 60 } });

  return { lines, icons };
}
