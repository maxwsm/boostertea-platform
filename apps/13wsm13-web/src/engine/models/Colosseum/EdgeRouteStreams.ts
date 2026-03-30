// ═══════════════════════════════════════════════════════════════════════
// MODEL: EDGE ROUTE STREAMS (Pack 5 / 15)
// Description: The massive traffic throughput of the Cloud Commander 
// (250,000 TPS). Rendered as high-velocity data streams across the arena.
// Coordinate Space: LAT 0.20, Penetrating straight through the Colosseum
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart } from "../../utils/math";

export function getEdgeRouteStreams(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const streamElev = 70; // Hovering at mid-height
  const length = 0.06; // Crossing the entire Colosseum boundaries
  
  for (let y = -0.01; y <= 0.01; y += 0.002) {
      // Create high-velocity particle lines from left to right
      const p1 = sphToCart(baseLat + y, -length, streamElev + (Math.random() * 5));
      const p2 = sphToCart(baseLat + y, length, streamElev + (Math.random() * 5));
      
      lines.push({ p1, p2, colorMode: 3, width: 0.5 }); // X-Ray/Neon glow
      
      // Dynamic moving packets (Initial markers for tracking)
      icons.push({ 
          p: sphToCart(baseLat + y, -length * Math.random(), streamElev + 2), 
          char: "—", 
          size: 16, 
          type: 'rune',
          meta: { isTrafficPacket: true, velocityX: 0.001 + Math.random() * 0.002, origin: -length, limit: length, latBase: baseLat + y, elev: streamElev }
      });
  }

  // DevOps Metadata
  icons.push({ p: sphToCart(baseLat, -length - 0.005, streamElev + 10), char: "[ WASHINGTON_NODE ]", size: 12, type: 'text' });
  icons.push({ p: sphToCart(baseLat, length + 0.005, streamElev + 10), char: "[ FRANKFURT_NODE ]", size: 12, type: 'text' });
  icons.push({ p: sphToCart(baseLat - 0.015, 0, streamElev - 20), char: "PEAK TPS: 250,000 // FLATLINE LATENCY", size: 18, type: 'text' });

  return { lines, icons };
}
