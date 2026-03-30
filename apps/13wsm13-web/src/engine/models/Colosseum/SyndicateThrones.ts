// ═══════════════════════════════════════════════════════════════════════
// MODEL: SYNDICATE THRONES (Pack 13 / 15)
// Description: The 9 architectural anchors for the 9 Neuro-Agents inside the 
// Colosseum arena. Structured as floating abstract hyper-cubes.
// Coordinate Space: LAT 0.20, Distributed equally around the radius
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../../utils/math";

export function getSyndicateThrones(baseLat: number, radius: number): { lines: PLine[], icons: PIcon[] } {
  const lines: PLine[] = [];
  const icons: PIcon[] = [];
  
  const agentCount = 9;
  const throneRadius = radius * 0.4; // Nested within the inner core space
  const throneElev = 25; // Floating just above ground

  const names = [
      "I. ARCHITECT", "II. CLOUD COMMANDER", "III. CYBER-DEV", 
      "IV. SYNAPSE WEAVER", "V. NEURO-PSYCHOLOGIST", "VI. DIRECTOR", 
      "VII. SYNDICATE BOSS", "VIII. CHAOS RANGER", "IX. AUDIO ENGINEER"
  ];

  for (let i = 0; i < agentCount; i++) {
      const angle = (i / agentCount) * TAU;
      
      const tLat = baseLat + Math.cos(angle) * throneRadius;
      const tLon = Math.sin(angle) * throneRadius;
      
      const pCenter = sphToCart(tLat, tLon, throneElev);

      // Render floating Abstract Hyper-Cube for each throne
      const s = 0.002; // size
      const h = 5;     // height
      
      const p1 = sphToCart(tLat - s, tLon - s, throneElev - h);
      const p2 = sphToCart(tLat + s, tLon - s, throneElev - h);
      const p3 = sphToCart(tLat + s, tLon + s, throneElev - h);
      const p4 = sphToCart(tLat - s, tLon + s, throneElev - h);
      
      const pTop1 = sphToCart(tLat - s, tLon - s, throneElev + h);
      const pTop2 = sphToCart(tLat + s, tLon - s, throneElev + h);
      const pTop3 = sphToCart(tLat + s, tLon + s, throneElev + h);
      const pTop4 = sphToCart(tLat - s, tLon + s, throneElev + h);
      
      // Bottom lines
      lines.push({ p1, p2, colorMode: 1, width: 0.5 });
      lines.push({ p1: p2, p2: p3, colorMode: 1, width: 0.5 });
      lines.push({ p1: p3, p2: p4, colorMode: 1, width: 0.5 });
      lines.push({ p1: p4, p2: p1, colorMode: 1, width: 0.5 });
      
      // Verticals
      lines.push({ p1, p2: pTop1, colorMode: 1, width: 1.0 });
      lines.push({ p1: p2, p2: pTop2, colorMode: 1, width: 1.0 });
      lines.push({ p1: p3, p2: pTop3, colorMode: 1, width: 1.0 });
      lines.push({ p1: p4, p2: pTop4, colorMode: 1, width: 1.0 });

      // Holographic projection line going up
      lines.push({ p1: pCenter, p2: sphToCart(tLat, tLon, throneElev + 30), colorMode: 2, width: 0.2 });

      // Agent Identity Text
      icons.push({ p: sphToCart(tLat, tLon, throneElev + 35), char: names[i], size: 10, type: 'text' });
  }

  return { lines, icons };
}
